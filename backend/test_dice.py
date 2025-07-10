import pandas as pd
import dice_ml
from app.dependencies import get_model, get_scaler


# Define the wrapper class for the XGBoost model
class WrappedXGBModel:
    def __init__(self, model, categorical_features):
        self.model = model
        self.categorical_features = categorical_features

    def predict(self, input_instance):
        # Ensure correct dtypes before prediction
        input_instance = input_instance.copy()
        input_instance[self.categorical_features] = input_instance[self.categorical_features].astype('category')
        return self.model.predict(input_instance)

    def predict_proba(self, input_instance):
        # Ensure correct dtypes before prediction
        input_instance = input_instance.copy()
        input_instance[self.categorical_features] = input_instance[self.categorical_features].astype('category')
        return self.model.predict_proba(input_instance)


# Initialize the wrapped model
categorical_features = ['Gender', 'HasCrCard', 'IsActiveMember', 'Geography_Germany', 'Geography_Spain']
model = WrappedXGBModel(get_model(), categorical_features)
scaler = get_scaler()

# Prepare the query instance
df = pd.DataFrame([{
    'CreditScore': 700,
    'Gender': 0,
    'Age': 30,
    'Tenure': 12,
    'Balance': 50000.0,
    'NumOfProducts': 2,
    'HasCrCard': 1,
    'IsActiveMember': 1,
    'EstimatedSalary': 60000.0,
    'Geography_Germany': 0,
    'Geography_Spain': 1
}])
numeric_features = ['CreditScore', 'Age', 'Tenure', 'Balance', 'NumOfProducts', 'EstimatedSalary']
model_features = numeric_features + categorical_features
df[numeric_features] = scaler.transform(df[numeric_features])
df[categorical_features] = df[categorical_features].astype('category')
query_instance = df[model_features]

# Load dataset and enforce dtypes
dataset = pd.read_csv('models/X_train_sample_with_churn.csv')
dataset[categorical_features] = dataset[categorical_features].astype('category')
dataset['Churn'] = dataset['Churn'].astype(int)
dataset[numeric_features] = dataset[numeric_features].astype(float)
print("Dataset dtypes before DiCE:", dataset.dtypes.to_string())

# Configure DiCE
d = dice_ml.Data(
    dataframe=dataset,
    continuous_features=numeric_features,
    outcome_name="Churn"
)
m = dice_ml.Model(model=model, backend="sklearn")
exp = dice_ml.Dice(d, m, method="genetic")

# Generate counterfactuals for Gender=0
dice_exp = exp.generate_counterfactuals(query_instance, total_CFs=3, desired_class="opposite")
cfs_df = dice_exp.cf_examples_list[0].final_cfs_df
cfs_df[categorical_features] = cfs_df[categorical_features].astype('category')
cfs_df[numeric_features] = cfs_df[numeric_features].astype(float)
print("Counterfactuals for Gender=0:")
print(cfs_df)

# Test with Gender=1
df['Gender'] = 1
df[numeric_features] = scaler.transform(df[numeric_features])
df[categorical_features] = df[categorical_features].astype('category')
query_instance = df[model_features]
dice_exp = exp.generate_counterfactuals(query_instance, total_CFs=3, desired_class="opposite")
cfs_df = dice_exp.cf_examples_list[0].final_cfs_df
cfs_df[categorical_features] = cfs_df[categorical_features].astype('category')
cfs_df[numeric_features] = cfs_df[numeric_features].astype(float)
print("\nCounterfactuals for Gender=1:")
print(cfs_df)