from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
import shap
import dice_ml
from dice_ml import Dice
import os
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware 

BASE_DIR = Path(__file__).resolve().parent.parent

app = FastAPI(title="Telecom Customer Churn Predictor")

# ✅ Add CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# Load models and data
scaler = joblib.load(BASE_DIR / "models" / "scaler.pkl")
model = joblib.load(BASE_DIR / "models" / "stacking_clf.joblib")

# Load and standardize column names
X_sample = pd.read_csv(BASE_DIR / "models" / "X_train_sample.csv")
X_sample.columns = X_sample.columns.str.replace(" ", "_").str.replace("-", "_")
expected_features = X_sample.columns.tolist()

# Initialize SHAP explainer
explainer = shap.Explainer(model.predict_proba, X_sample)

# Initialize DiCE
df_train = pd.read_csv(BASE_DIR / "models" / "train_sample.csv")
df_train.columns = df_train.columns.str.replace(" ", "_").str.replace("-", "_")

continuous_features = [
    'Age','Avg_Monthly_GB_Download','Avg_Monthly_Long_Distance_Charges',
    'CLTV','Monthly_Charge','Population','Total_Extra_Data_Charges',
    'Total_Long_Distance_Charges','Total_Refunds','Total_Revenue',
    'Tenure_in_Months','Monthly_to_Total_Ratio','Number_of_Dependents',
    'Number_of_Referrals','Dependents'
]

d_data = dice_ml.Data(
    dataframe=df_train,
    continuous_features=continuous_features,
    outcome_name='Churn'
)

d_model = dice_ml.Model(model=model, backend="sklearn")
dice_exp = Dice(data_interface=d_data, model_interface=d_model, method="random")

# Scaled features list
scaled_cols = [
    'Age', 'Avg_Monthly_GB_Download', 'Avg_Monthly_Long_Distance_Charges',
    'CLTV', 'Monthly_Charge', 'Population', 'Total_Extra_Data_Charges',
    'Total_Long_Distance_Charges', 'Total_Refunds', 'Total_Revenue',
    'Tenure_in_Months', 'Monthly_to_Total_Ratio', 'Number_of_Dependents',
    'Number_of_Referrals', 'Dependents'
]

class CustomerData(BaseModel):
    Age: float
    Avg_Monthly_GB_Download: float
    Avg_Monthly_Long_Distance_Charges: float
    CLTV: float
    Monthly_Charge: float
    Population: float
    Total_Extra_Data_Charges: float
    Total_Long_Distance_Charges: float
    Total_Refunds: float
    Total_Revenue: float
    Tenure_in_Months: float
    Monthly_to_Total_Ratio: float  # ✅ Only once
    Number_of_Dependents: float
    Number_of_Referrals: float
    Dependents: float
    Device_Protection_Plan: int
    Gender: int
    Internet_Service: int
    Married: int
    Multiple_Lines: int
    Online_Backup: int
    Online_Security: int
    Paperless_Billing: int
    Partner: int
    Phone_Service: int
    Premium_Tech_Support: int
    Referred_a_Friend: int
    Satisfaction_Score: int
    Senior_Citizen: int
    Streaming_Movies: int
    Streaming_Music: int
    Streaming_TV: int
    Unlimited_Data: int
    Tenure_Quartile: int
    Early_Churner_Risk: int
    Low_Satisfaction: int
    Contract_One_Year: int
    Contract_Two_Year: int
    Internet_Type_DSL: int
    Internet_Type_Fiber_Optic: int
    Internet_Type_No_Internet: int
    Offer_Offer_A: int
    Offer_Offer_B: int
    Offer_Offer_C: int
    Offer_Offer_D: int
    Offer_Offer_E: int
    Payment_Method_Credit_Card: int
    Payment_Method_Mailed_Check: int

# ... rest of your endpoints and ACTION_MAP remain the same ...


@app.post("/predict")
def predict(data: CustomerData):
    input_dict = data.dict()
    # Split into scaled and unscaled features
    X_num = pd.DataFrame([{col: input_dict[col] for col in scaled_cols}])
    X_other = pd.DataFrame([{col: input_dict[col] for col in input_dict if col not in scaled_cols}])

    # Scale numeric features only
    X_num_scaled = scaler.transform(X_num)
    X_num_scaled_df = pd.DataFrame(X_num_scaled, columns=scaled_cols)

    # Concatenate features into correct order as used in training/model
    # Expected order: scaled_cols + list(X_other.columns) == model input columns order
    model_input = pd.concat([X_num_scaled_df, X_other], axis=1)[expected_features]  # expected_features is your full feature list in training order

    # Predict
    proba = model.predict_proba(model_input)[:,1][0]
    prediction = int(proba > 0.5)
    return {
        "prediction": prediction,
        "churn_probability": round(proba, 4)
    }

@app.post("/explain")
def explain(data: CustomerData):
    input_dict = data.dict()
    
    # Preprocess input exactly like in /predict
    X_num = pd.DataFrame([{col: input_dict.get(col, 0) for col in scaled_cols}])
    X_other = pd.DataFrame([{col: input_dict.get(col, 0) for col in input_dict if col not in scaled_cols}])
    
    # Scale numeric features
    X_num_scaled = scaler.transform(X_num)
    X_num_scaled_df = pd.DataFrame(X_num_scaled, columns=scaled_cols)
    
    # Combine scaled and unscaled features
    input_df = pd.concat([X_num_scaled_df, X_other], axis=1)[expected_features]
    
    # Use stacked model for prediction
    proba = model.predict_proba(input_df)[:, 1][0]
    prediction = int(proba > 0.5)
    
    # Generate SHAP explanation for ANY prediction
    shap_values = explainer(input_df)
    
    # Extract SHAP values correctly for classification
    if hasattr(shap_values, 'values') and len(shap_values.values.shape) == 3:
        feature_impacts = shap_values.values[0, :, 1]  # First sample, all features, class 1
    elif hasattr(shap_values, 'values') and len(shap_values.values.shape) == 2:
        feature_impacts = shap_values.values[0, :]  # First sample, all features
    else:
        feature_impacts = shap_values[0].values
    
    # Create feature contributions for ALL features
    all_feature_contributions = list(zip(input_df.columns, feature_impacts))
    top_features = sorted(all_feature_contributions, key=lambda x: abs(x[1]), reverse=True)[:10]
    
    # ✅ Ensure SHAP data has proper numeric values
    shap_data = []
    for feat, impact in all_feature_contributions:
        # Convert numpy values to Python floats
        impact_value = float(impact) if hasattr(impact, 'item') else float(impact)
        
        # Skip features with zero impact
        if abs(impact_value) > 1e-8:  # Only include features with meaningful impact
            shap_data.append({
                "feature": feat.replace("_", " ").title(),
                "impact": impact_value,
                "direction": "Increases churn risk" if impact_value > 0 else "Decreases churn risk",
                "abs_impact": abs(impact_value)
            })
    
    # Sort by absolute impact for visualization
    shap_data_sorted = sorted(shap_data, key=lambda x: x['abs_impact'], reverse=True)
    
    return {
        "churn_probability": round(proba, 4),
        "prediction": prediction,
        "explanation": f"Features that most influence this {'churn' if prediction == 1 else 'retention'} prediction",
        "top_features": [
            {
                "feature": feat.replace("_", " ").title(),
                "impact": round(float(impact), 4),
                "direction": "Increases churn risk" if impact > 0 else "Decreases churn risk"
            }
            for feat, impact in top_features
        ],
        "shap_data": shap_data_sorted[:15],  # Top 15 features for chart
        "base_value": 0.0
    }


@app.post("/counterfactual")
def counterfactual(
    data: CustomerData,
    desired_class: int = Query(0, ge=0, le=1),
    total_CFs: int = Query(1, ge=1, le=5)
):
    # 1. Build raw input_df (no scaling!)
    inp = data.dict()
    input_df = pd.DataFrame([{col: inp[col] for col in expected_features}])
    
    # 2. Get current prediction for context
    current_prediction = model.predict(input_df)[0]
    current_proba = model.predict_proba(input_df)[:, 1][0]
    
    # 3. Define actionable features only
    actionable_features = [
        'Monthly_Charge', 'Satisfaction_Score', 'Contract_One_Year', 'Contract_Two_Year',
        'Premium_Tech_Support', 'Device_Protection_Plan', 'Online_Security', 
        'Online_Backup', 'Streaming_Movies', 'Streaming_TV', 'Unlimited_Data',
        'Paperless_Billing', 'Multiple_Lines', 'Tenure_in_Months'
    ]
    
    try:
        # 4. Attempt DiCE counterfactual generation with actionable features
        cf_results = dice_exp.generate_counterfactuals(
            input_df,
            total_CFs=total_CFs,
            desired_class=desired_class,
            features_to_vary=actionable_features,
            posthoc_sparsity_param=0.1,  # Allow fewer feature changes
            diversity_weight=0.5          # Reduce diversity requirement
        )
        
        # 5. Extract counterfactual if successful
        cf_df = cf_results.cf_examples_list[0].final_cfs_df
        
        if cf_df.empty:
            raise Exception("Empty counterfactual dataframe")
            
        cf_dict = cf_df.iloc[0].to_dict()
        actions = build_actions(original=input_df.iloc[0].to_dict(), cf_row=cf_dict)
        
        return {
            "success": True,
            "method": "DiCE_generated",
            "current_prediction": int(current_prediction),
            "current_churn_probability": round(current_proba, 4),
            "original": input_df.iloc[0].to_dict(),
            "counterfactual": cf_dict,
            "suggested_actions": actions
        }
        
    except Exception as dice_error:
        # 6. Fallback: Rule-based retention strategy for high-risk customers
        fallback_actions = generate_fallback_actions(inp, current_proba)
        
        return {
            "success": True,
            "method": "fallback_rules",
            "current_prediction": int(current_prediction),
            "current_churn_probability": round(current_proba, 4),
            "original": input_df.iloc[0].to_dict(),
            "message": "DiCE could not generate counterfactuals. Using rule-based retention strategy.",
            "dice_error": str(dice_error),
            "suggested_actions": fallback_actions
        }


ACTION_MAP = {
    # ── PRICE & REVENUE DRIVERS ──────────────────────────────────────────
    "Monthly_Charge": {
        # lower price to reduce perceived cost pain
        "decrease": "Apply ₹150 monthly loyalty credit for the next 6 months",
        # raise price only for upsell scenarios
        "increase": "Bundle 50 GB extra data add-on at ₹99/month incremental"
    },
    "Total_Extra_Data_Charges": {
        "decrease": "Offer add-on Unlimited Data at 40 % off to remove overage fees"
    },
    "Total_Long_Distance_Charges": {
        "decrease": "Activate long-distance pack (₹0.50/min) free for 3 months"
    },

    # ── CONTRACT TENURE / LOCK-IN ────────────────────────────────────────
    "Contract_One_Year": {
        "increase": "Upsell to 1-year contract with 1-month fee waiver + free router"
    },
    "Contract_Two_Year": {
        "increase": "Upgrade to 2-year ‘Secure Saver’ plan ⟹ 10 % bill reduction + premium support"
    },

    # ── SATISFACTION & SERVICE QUALITY ───────────────────────────────────
    "Satisfaction_Score": {
        "increase": "Schedule proactive call: resolve pain-points, offer priority ticket routing"
    },
    "Low_Satisfaction": {
        # 0→1 already captured above; lowering flag is goal
        "decrease": "Trigger ‘White-Glove Care’ workflow: assign dedicated service agent until NPS ≥ 8"
    },
    "Early_Churner_Risk": {
        "decrease": "Send personalised welcome email series + ₹200 first-year bill credit if they remain 90 days"
    },

    # ── INTERNET TECHNOLOGY & SPEED ──────────────────────────────────────
    "Internet_Type_Fiber_Optic": {
        # keeping fiber but lowering price is cheaper than downgrading
        "decrease": "Offer switch to 100 Mbps DSL with ₹200 monthly savings"
    },
    "Internet_Type_No_Internet": {
        "increase": "Cross-sell 50 Mbps fiber broadband at bundle discount of 15 %"
    },

    # ── SERVICE ADD-ONS & FEATURES ───────────────────────────────────────
    "Premium_Tech_Support": {
        "increase": "Add Premium Tech Support at 50 % discount for first year"
    },
    "Device_Protection_Plan": {
        "increase": "Bundle device protection at ₹49/month with first month free"
    },
    "Unlimited_Data": {
        "increase": "Upsell Unlimited 5G data add-on at ₹199/month (50 % off retail)"
    },
    "Streaming_Movies": {
        "increase": "Include OTT Movie Pack free for 3 months to boost engagement"
    },
    "Streaming_TV": {
        "increase": "Provide Smart TV subscription at ₹99/month (retail ₹299) for 6 months"
    },

    # ── REFERRAL & FRIEND PROGRAMS ───────────────────────────────────────
    "Referred_a_Friend": {
        "increase": "Send ‘Refer & Earn’ email: ₹500 bill credit per successful referral"
    },
    "Number_of_Referrals": {
        "increase": "Unlock tiered referral bonus: free month after 3 referrals"
    },

    # ── TENURE & LOYALTY ────────────────────────────────────────────────
    "Tenure_in_Months": {
        "increase": "Enroll in Silver Loyalty tier: 5 % lifetime discount after 24 months stay"
    },
    "Tenure_Quartile": {
        "increase": "Offer milestone gift (e.g., Bluetooth earbuds) when customer enters next tenure band"
    },

    # ── BILLING & PAYMENT EXPERIENCE ────────────────────────────────────
    "Paperless_Billing": {
        "increase": "Provide ₹50/month e-bill discount + carbon-neutral badge"
    },
    "Payment_Method_Credit_Card": {
        "increase": "Enable auto-pay on credit card and give 2 % cashback on next bill"
    },
    "Payment_Method_Mailed_Check": {
        "decrease": "Encourage switch to digital payments with one-time ₹100 credit"
    },

    # ── DATA-USAGE & SPEED COMPLAINTS (CLTV-FOCUSED) ─────────────────────
    "Avg_Monthly_GB_Download": {
        # if usage is high, upsell higher speed tiers
        "increase": "Upgrade to 300 Mbps plan: +₹200/month, free first-month trial"
    },

    # ── TECHNICAL SUPPORT FLAGS ─────────────────────────────────────────
    "Premium_Tech_Support": {
        "decrease": "If unnecessary, downgrade and credit ₹120/month"
    },

    # ── CUSTOMER DEMOGRAPHICS (AGE, UNDER 30) ───────────────────────────
    "Under_30": {
        "increase": "Offer student streaming bundle: 25 % off + free gaming add-on"
    },
    "Senior_Citizen": {
        "increase": "Activate Senior Connect plan: priority support & fixed 5 % lifetime discount"
    },
    "Population": {
        "decrease": "Geographic targeting not applicable - focus on service improvements",
        "increase": "Geographic targeting not applicable - focus on service improvements"
    }

}


def build_actions(original, cf_row):
    actions = []
    for col, orig_val in original.items():
        cf_val = cf_row[col]
        
        # Skip if values are identical
        if orig_val == cf_val:
            continue
            
        # Convert to float for comparison (handle string/numeric mismatches)
        try:
            orig_numeric = float(orig_val)
            cf_numeric = float(cf_val)
        except (ValueError, TypeError):
            # Skip non-numeric features that can't be compared
            continue
            
        # Determine direction of change
        if abs(cf_numeric - orig_numeric) < 1e-6:  # Essentially equal (floating point precision)
            continue
            
        direction = "increase" if cf_numeric > orig_numeric else "decrease"
        advice = ACTION_MAP.get(col, {}).get(direction)
        
        if advice:
            actions.append({
                "feature": col,
                "action": advice,
                "original_value": orig_numeric,
                "suggested_value": cf_numeric,
                "change": round(cf_numeric - orig_numeric, 2)
            })
    
    return actions


def generate_fallback_actions(customer_data, churn_probability):
    """Generate rule-based retention actions when DiCE fails"""
    actions = []
    
    # Rule 1: Very low satisfaction (score <= 2)
    if customer_data.get('Satisfaction_Score', 5) <= 2:
        actions.append({
            "feature": "Satisfaction_Score",
            "action": "URGENT: Assign dedicated customer success manager for immediate intervention",
            "priority": "HIGH"
        })
    
    # Rule 2: High monthly charges (> ₹80)
    if customer_data.get('Monthly_Charge', 0) > 80:
        actions.append({
            "feature": "Monthly_Charge", 
            "action": "Apply immediate 20% discount for next 6 months + loyalty review",
            "priority": "HIGH"
        })
    
    # Rule 3: Short tenure (< 6 months)
    if customer_data.get('Tenure_in_Months', 100) < 6:
        actions.append({
            "feature": "Tenure_in_Months",
            "action": "Activate new customer retention program: welcome bonus + extended support",
            "priority": "MEDIUM"
        })
    
    # Rule 4: No contract commitment (month-to-month)
    if (customer_data.get('Contract_One_Year', 0) == 0 and 
        customer_data.get('Contract_Two_Year', 0) == 0):
        actions.append({
            "feature": "Contract_Two_Year",
            "action": "Offer 2-year contract with 15% discount + free premium services",
            "priority": "MEDIUM"
        })
    
    # Rule 5: No premium services (engagement issue)
    premium_services = ['Premium_Tech_Support', 'Device_Protection_Plan', 'Online_Security', 'Streaming_Movies', 'Streaming_TV']
    if sum(customer_data.get(service, 0) for service in premium_services) == 0:
        actions.append({
            "feature": "Premium_Services",
            "action": "Bundle 3 premium services at 60% off to increase engagement",
            "priority": "MEDIUM"
        })
    
    # Rule 6: Extremely high churn risk (> 95%)
    if churn_probability > 0.95:
        actions.append({
            "feature": "Executive_Intervention",
            "action": "CRITICAL: Executive retention team immediate contact within 24 hours",
            "priority": "CRITICAL"
        })
    
    return actions
