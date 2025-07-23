import joblib
import os

MODEL_PATH = "models/best_xgb_model.joblib"
SCALER_PATH = "models/scaler.pkl"

model = None
scaler = None

try:
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
    if os.path.exists(SCALER_PATH):
        scaler = joblib.load(SCALER_PATH)
except Exception as e:
    print(f"Error loading model or scaler: {e}")


def get_model():
    if model is None:
        raise ValueError("Model not loaded")
    return model


def get_scaler():
    if scaler is None:
        raise ValueError("Scaler not loaded")
    return scaler
