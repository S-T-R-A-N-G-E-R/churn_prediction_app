from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routers import health_router
from app.database import startup_event

app = FastAPI()

# Enable CORS for all routes, including static files
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

startup_event(app)

app.include_router(health_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Customer Churn Prediction API"}