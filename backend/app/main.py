from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import health_router as health

app = FastAPI(
    title="Customer Churn Prediction API",
    description="API for predicting customer churn and providing insights",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health)


@app.get("/")
async def root():
    return {"message": "Welcome to the Customer Churn Prediction API"}
