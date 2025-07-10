from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import health_router
from app.database import startup_event

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow React dev server
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)

startup_event(app)

app.include_router(health_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Customer Churn Prediction API"}