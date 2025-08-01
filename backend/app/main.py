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
import logging
from fastapi.middleware.cors import CORSMiddleware 


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://churn-prediction-app.vercel.app",
    "https://churn-prediction-app-git-main-s-t-r-a-n-g-e-rs-projects.vercel.app",
    "https://churn-prediction-ed5vs8aso-s-t-r-a-n-g-e-rs-projects.vercel.app"
    
]

BASE_DIR = Path(__file__).resolve().parent.parent

app = FastAPI(title="Telecom Customer Churn Predictor")

# ✅ Add CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
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

@app.get("/")
def read_root():
    return {"message":"Churn Prediction API is running. Use /docs for API docs."}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


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
    model_input = pd.concat([X_num_scaled_df, X_other], axis=1)[expected_features]

    # Predict
    proba = model.predict_proba(model_input)[:,1][0]
    prediction = int(proba > 0.5)
    return {
        "prediction": prediction,
        "churn_probability": round(proba, 4)
    }

from datetime import datetime
from fastapi import HTTPException

@app.post("/explain")
def explain(data: CustomerData):
    try:
        input_dict = data.dict()
        if not input_dict:
            raise HTTPException(status_code=400, detail="Empty customer data provided")
        
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
        
        # Generate SHAP explanation with error handling
        try:
            shap_values = explainer(input_df)
            logging.info(f"SHAP values shape: {shap_values.shape if hasattr(shap_values, 'shape') else 'N/A'}")
            logging.info(f"SHAP values: {shap_values.values if hasattr(shap_values, 'values') else shap_values}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"SHAP calculation failed: {str(e)}")
        
        # Extract SHAP values correctly for classification
        try:
            if hasattr(shap_values, 'values'):
                if len(shap_values.values.shape) == 3:
                    feature_impacts = shap_values.values[0, :, 1]  # For multi-output models, class 1
                elif len(shap_values.values.shape) == 2:
                    feature_impacts = shap_values.values[0, :]  # Single sample, all features
                else:
                    raise ValueError("Unexpected SHAP values shape")
            else:
                feature_impacts = shap_values[0].values  # Fallback for older SHAP versions
            logging.info(f"Extracted feature impacts: {feature_impacts}")
        except (IndexError, ValueError, AttributeError) as e:
            raise HTTPException(status_code=500, detail=f"SHAP value extraction failed: {str(e)}")
        
        # Create feature contributions for ALL features
        all_feature_contributions = list(zip(input_df.columns, feature_impacts))
        top_features = sorted(all_feature_contributions, key=lambda x: abs(x[1]), reverse=True)[:10]
        
        # Ensure SHAP data has proper numeric values (removed strict 1e-8 filter)
        shap_data = []
        for feat, impact in all_feature_contributions:
            try:
                impact_value = float(impact) if hasattr(impact, 'item') else float(impact)
                if impact_value != 0:  # Include all non-zero impacts
                    shap_data.append({
                        "feature": feat.replace("_", " ").title(),
                        "impact": impact_value,
                        "direction": "Increases churn risk" if impact_value > 0 else "Decreases churn risk",
                        "abs_impact": abs(impact_value)
                    })
            except (ValueError, TypeError):
                continue  # Skip features with conversion issues
        
        # Sort by absolute impact for visualization
        shap_data_sorted = sorted(shap_data, key=lambda x: x['abs_impact'], reverse=True)
        
        return {
            "churn_probability": round(float(proba), 4),
            "prediction": int(prediction),
            "explanation": f"Features that most influence this {'churn' if prediction == 1 else 'retention'} prediction",
            "top_features": [
                {
                    "feature": feat.replace("_", " ").title(),
                    "impact": round(float(impact), 4),
                    "direction": "Increases churn risk" if impact > 0 else "Decreases churn risk"
                }
                for feat, impact in top_features
            ],
            "shap_data": shap_data_sorted[:15],
            "base_value": float(getattr(explainer, 'expected_value', 0.0)),
            "model_confidence": "high" if abs(proba - 0.5) > 0.3 else "medium" if abs(proba - 0.5) > 0.1 else "low",
            "feature_count": len(shap_data_sorted),
            "timestamp": datetime.now().isoformat()
        }
        
    except HTTPException:
        raise

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
            posthoc_sparsity_param=0.1,
            diversity_weight=0.5
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
    # ... (unchanged)
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
            continue
            
        if abs(cf_numeric - orig_numeric) < 1e-6:
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
    
    if customer_data.get('Satisfaction_Score', 5) <= 2:
        actions.append({
            "feature": "Satisfaction_Score",
            "action": "URGENT: Assign dedicated customer success manager for immediate intervention",
            "priority": "HIGH"
        })
    
    if customer_data.get('Monthly_Charge', 0) > 80:
        actions.append({
            "feature": "Monthly_Charge", 
            "action": "Apply immediate 20% discount for next 6 months + loyalty review",
            "priority": "HIGH"
        })
    
    if customer_data.get('Tenure_in_Months', 100) < 6:
        actions.append({
            "feature": "Tenure_in_Months",
            "action": "Activate new customer retention program: welcome bonus + extended support",
            "priority": "MEDIUM"
        })
    
    if (customer_data.get('Contract_One_Year', 0) == 0 and 
        customer_data.get('Contract_Two_Year', 0) == 0):
        actions.append({
            "feature": "Contract_Two_Year",
            "action": "Offer 2-year contract with 15% discount + free premium services",
            "priority": "MEDIUM"
        })
    
    premium_services = ['Premium_Tech_Support', 'Device_Protection_Plan', 'Online_Security', 'Streaming_Movies', 'Streaming_TV']
    if sum(customer_data.get(service, 0) for service in premium_services) == 0:
        actions.append({
            "feature": "Premium_Services",
            "action": "Bundle 3 premium services at 60% off to increase engagement",
            "priority": "MEDIUM"
        })
    
    if churn_probability > 0.95:
        actions.append({
            "feature": "Executive_Intervention",
            "action": "CRITICAL: Executive retention team immediate contact within 24 hours",
            "priority": "CRITICAL"
        })
    
    return actions