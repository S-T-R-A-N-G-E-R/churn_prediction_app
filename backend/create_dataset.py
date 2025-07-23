import pandas as pd

df = pd.read_csv('models/X_train_sample_with_churn.csv')
categorical_features = ['Gender', 'HasCrCard', 'IsActiveMember', 'Geography_Germany', 'Geography_Spain']
numeric_features = ['CreditScore', 'Age', 'Tenure', 'Balance', 'NumOfProducts', 'EstimatedSalary']
df[categorical_features] = df[categorical_features].astype('category')
df['Churn'] = df['Churn'].astype(int)
df[numeric_features] = df[numeric_features].astype(float)
df.to_csv('models/X_train_sample_with_churn.csv', index=False)
print('Saved X_train_sample_with_churn.csv with columns:', df.columns.tolist())
print('Dtypes:', df.dtypes.to_string())
print('Sample rows:')
print(df.head().to_string())
