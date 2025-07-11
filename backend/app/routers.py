from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import pandas as pd
import shap
import dice_ml
from app.dependencies import get_model, get_scaler
from app.database import get_db
import aiosqlite

health_router = APIRouter()


@health_router.get("/health")
async def health_check():
    return {"status": "healthy"}


class PredictionInput(BaseModel):
    CreditScore: int
    Gender: int
    Age: int
    Tenure: int
    Balance: float
    NumOfProducts: int
    HasCrCard: int
    IsActiveMember: int
    EstimatedSalary: float
    Geography_Germany: int
    Geography_Spain: int


class WrappedXGBModel:
    def __init__(self, model, categorical_features):
        self.model = model
        self.categorical_features = categorical_features

    def predict(self, input_instance):
        input_instance = input_instance.copy()
        input_instance[self.categorical_features] = input_instance[self.categorical_features].astype('category')
        return self.model.predict(input_instance)

    def predict_proba(self, input_instance):
        input_instance = input_instance.copy()
        input_instance[self.categorical_features] = input_instance[self.categorical_features].astype('category')
        return self.model.predict_proba(input_instance)


import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@health_router.post("/predict")
async def predict_churn(data: PredictionInput, db: aiosqlite.Connection = Depends(get_db)):
    try:
        model = WrappedXGBModel(get_model(), ['Gender', 'HasCrCard', 'IsActiveMember', 'Geography_Germany', 'Geography_Spain'])
        scaler = get_scaler()
        input_data = pd.DataFrame([data.dict()])
        numeric_features = ['CreditScore', 'Age', 'Tenure', 'Balance', 'NumOfProducts', 'EstimatedSalary']
        categorical_features = ['Gender', 'HasCrCard', 'IsActiveMember', 'Geography_Germany', 'Geography_Spain']
        model_features = numeric_features + categorical_features
        input_numeric = input_data[numeric_features]
        input_scaled_numeric = scaler.transform(input_numeric)
        input_scaled = pd.DataFrame(input_scaled_numeric, columns=numeric_features, index=input_data.index)
        input_final = pd.concat([input_scaled, input_data[categorical_features]], axis=1)[model_features]
        input_final[categorical_features] = input_final[categorical_features].astype('category')
        prediction = model.predict(input_final)[0]
        probability = model.predict_proba(input_final)[0][1]

        # Calculate SHAP values
        explainer = shap.TreeExplainer(model.model)
        shap_values = explainer.shap_values(input_final)[0]  # SHAP values for class 1
        feature_names = input_final.columns
        shap_importance = {name: float(abs(value)) for name, value in zip(feature_names, shap_values)}
        top_shap_features = dict(sorted(shap_importance.items(), key=lambda x: x[1], reverse=True)[:5])

        # Calculate additional fields
        risk_category = "High" if probability > 0.7 else "Medium" if probability > 0.3 else "Low"
        clv_potential_loss = data.EstimatedSalary * (0.5 if prediction == 1 else 0.1)

        # Generate counterfactuals
        counterfactuals = []
        if prediction == 1:  # If predicted to churn
            cf_data = input_data.copy()
            original_prob = probability
            logger.info(f"Original probability: {original_prob}, Prediction: {prediction}")
            for adjustment in [
                {'Age': max(18, cf_data['Age'].iloc[0] - 15), 'IsActiveMember': 1, 'Tenure': 10},
                {'NumOfProducts': min(4, cf_data['NumOfProducts'].iloc[0] + 2), 'IsActiveMember': 1, 'Tenure': 10},
                {'Balance': cf_data['Balance'].iloc[0] * 0.5, 'IsActiveMember': 1}
            ]:
                cf_data_adjusted = cf_data.copy()
                for feature, value in adjustment.items():
                    cf_data_adjusted[feature] = value
                cf_scaled = pd.DataFrame(scaler.transform(cf_data_adjusted[numeric_features]), columns=numeric_features, index=cf_data_adjusted.index)
                cf_final = pd.concat([cf_scaled, cf_data_adjusted[categorical_features]], axis=1)[model_features]
                cf_final[categorical_features] = cf_final[categorical_features].astype('category')
                cf_prediction = model.predict(cf_final)[0]
                cf_probability = model.predict_proba(cf_final)[0][1]
                changes = [f"Set {k} to {v}" for k, v in adjustment.items()]
                logger.info(f"Adjustment: {changes}, New Prediction: {cf_prediction}, New Probability: {cf_probability}")
                if cf_prediction == 0 and cf_probability < original_prob:
                    counterfactuals.append({
                        "changes": changes,
                        "new_prediction": "No Churn",
                        "new_probability": float(cf_probability)
                    })
                elif cf_prediction == 1 and cf_probability < original_prob * 0.8:
                    counterfactuals.append({
                        "changes": changes,
                        "new_prediction": "Churn (Reduced Risk)",
                        "new_probability": float(cf_probability)
                    })

        # Generate business recommendations
        recommendations = []
        if prediction == 1:  # Churn predicted
            recommendations.append("Consider targeted retention campaigns for this customer due to high churn risk.")
            if counterfactuals:
                recommendations.append(f"Implement the suggested changes ({', '.join(counterfactuals[0]['changes'])}) to potentially reduce churn risk to {counterfactuals[0]['new_probability']*100:.2f}%.")
            else:
                recommendations.append("Explore significant incentives (e.g., extended tenure, increased product offerings) to retain this customer.")
        else:  # No churn predicted
            recommendations.append("Continue current engagement strategies; this customer is at low risk of churn.")
            if probability > 0.3:
                recommendations.append("Monitor engagement metrics closely as there is a moderate churn probability.")

        await db.execute(
            "INSERT INTO predictions (CreditScore, Gender, Age, Tenure, Balance, "
            "NumOfProducts, HasCrCard, IsActiveMember, EstimatedSalary, Geography_Germany, "
            "Geography_Spain, prediction, probability) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (data.CreditScore, data.Gender, data.Age, data.Tenure, data.Balance,
             data.NumOfProducts, data.HasCrCard, data.IsActiveMember, data.EstimatedSalary,
             data.Geography_Germany, data.Geography_Spain, int(prediction), float(probability))
        )
        await db.commit()

        return {
            "prediction": int(prediction),
            "probability": float(probability),
            "risk_category": risk_category,
            "clv_potential_loss": float(clv_potential_loss),
            "shap_values": top_shap_features,
            "counterfactuals": counterfactuals if counterfactuals else None,
            "recommendations": recommendations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@health_router.post("/shap")
async def shap_analysis(data: PredictionInput):
    try:
        model = WrappedXGBModel(get_model(), ['Gender', 'HasCrCard', 'IsActiveMember', 'Geography_Germany', 'Geography_Spain'])
        scaler = get_scaler()
        input_data = pd.DataFrame([data.dict()])
        numeric_features = ['CreditScore', 'Age', 'Tenure', 'Balance', 'NumOfProducts', 'EstimatedSalary']
        categorical_features = ['Gender', 'HasCrCard', 'IsActiveMember', 'Geography_Germany', 'Geography_Spain']
        model_features = numeric_features + categorical_features
        input_numeric = input_data[numeric_features]
        input_scaled_numeric = scaler.transform(input_numeric)
        input_scaled = pd.DataFrame(input_scaled_numeric, columns=numeric_features, index=input_data.index)
        input_final = pd.concat([input_scaled, input_data[categorical_features]], axis=1)[model_features]
        input_final[categorical_features] = input_final[categorical_features].astype('category')

        explainer = shap.TreeExplainer(model.model)  # Use original model for SHAP
        shap_values = explainer.shap_values(input_final)
        feature_names = input_final.columns
        shap_dict = {name: float(value) for name, value in zip(feature_names, shap_values[0])}

        return {"shap_values": shap_dict}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SHAP error: {str(e)}")


@health_router.post("/counterfactuals")
async def counterfactuals(data: PredictionInput):
    try:
        model = WrappedXGBModel(get_model(), ['Gender', 'HasCrCard', 'IsActiveMember', 'Geography_Germany', 'Geography_Spain'])
        scaler = get_scaler()
        input_data = pd.DataFrame([data.dict()])
        numeric_features = ['CreditScore', 'Age', 'Tenure', 'Balance', 'NumOfProducts', 'EstimatedSalary']
        categorical_features = ['Gender', 'HasCrCard', 'IsActiveMember', 'Geography_Germany', 'Geography_Spain']
        model_features = numeric_features + categorical_features
        input_numeric = input_data[numeric_features]
        input_scaled_numeric = scaler.transform(input_numeric)
        input_scaled = pd.DataFrame(input_scaled_numeric, columns=numeric_features, index=input_data.index)
        input_final = pd.concat([input_scaled, input_data[categorical_features]], axis=1)[model_features]
        input_final[categorical_features] = input_final[categorical_features].astype('category')

        # Load dataset and enforce dtypes
        dataset = pd.read_csv('models/X_train_sample_with_churn.csv')
        dataset[categorical_features] = dataset[categorical_features].astype('category')
        dataset['Churn'] = dataset['Churn'].astype(int)
        dataset[numeric_features] = dataset[numeric_features].astype(float)

        d = dice_ml.Data(
            dataframe=dataset,
            continuous_features=numeric_features,
            outcome_name="Churn"
        )
        m = dice_ml.Model(model=model, backend="sklearn")
        exp = dice_ml.Dice(d, m, method="genetic")

        dice_exp = exp.generate_counterfactuals(
            input_final, total_CFs=3, desired_class="opposite"
        )
        cfs_df = dice_exp.cf_examples_list[0].final_cfs_df
        cfs_df[categorical_features] = cfs_df[categorical_features].astype('category')
        cfs_df[numeric_features] = cfs_df[numeric_features].astype(float)
        cfs = cfs_df.to_dict(orient="records")

        return {"counterfactuals": cfs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Counterfactuals error: {str(e)}")


@health_router.get("/model-performance")
async def get_model_performance():
    try:
        # Placeholder metrics (replace with actual values from your model evaluation)
        performance = {
            "accuracy": 0.87,  # 85.2%
            "precision": 0.87,  # 87.4%
            "recall": 0.86,    # 83.9%
            "f1_score": 0.87   # 85.6%
        }
        return performance
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching model performance: {str(e)}")
    

@health_router.get("/feature-importance")
async def get_feature_importance():
    try:
        # Placeholder: Use a sample input to compute SHAP values
        sample_input = {
            "CreditScore": 600,
            "Gender": 1,
            "Age": 40,
            "Tenure": 3,
            "Balance": 50000.0,
            "NumOfProducts": 2,
            "HasCrCard": 1,
            "IsActiveMember": 1,
            "EstimatedSalary": 50000.0,
            "Geography_Germany": 0,
            "Geography_Spain": 0
        }
        input_data = pd.DataFrame([sample_input])
        model = WrappedXGBModel(get_model(), ['Gender', 'HasCrCard', 'IsActiveMember', 'Geography_Germany', 'Geography_Spain'])
        scaler = get_scaler()
        numeric_features = ['CreditScore', 'Age', 'Tenure', 'Balance', 'NumOfProducts', 'EstimatedSalary']
        categorical_features = ['Gender', 'HasCrCard', 'IsActiveMember', 'Geography_Germany', 'Geography_Spain']
        input_numeric = input_data[numeric_features]
        input_scaled_numeric = scaler.transform(input_numeric)
        input_scaled = pd.DataFrame(input_scaled_numeric, columns=numeric_features, index=input_data.index)
        input_final = pd.concat([input_scaled, input_data[categorical_features]], axis=1)
        input_final[categorical_features] = input_final[categorical_features].astype('category')

        explainer = shap.TreeExplainer(model.model)
        shap_values = explainer.shap_values(input_final)[0]  # SHAP values for class 1
        feature_names = input_final.columns
        importance = {name: float(abs(value)) for name, value in zip(feature_names, shap_values)}  # Convert to float
        # Sort by absolute importance and take top 5
        top_features = dict(sorted(importance.items(), key=lambda x: x[1], reverse=True)[:5])

        return top_features
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching feature importance: {str(e)}")