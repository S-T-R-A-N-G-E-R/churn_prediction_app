import aiosqlite
from fastapi import FastAPI


async def init_db():
    async with aiosqlite.connect("models/predictions.db") as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS predictions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                CreditScore INTEGER,
                Gender INTEGER,
                Age INTEGER,
                Tenure INTEGER,
                Balance FLOAT,
                NumOfProducts INTEGER,
                HasCrCard INTEGER,
                IsActiveMember INTEGER,
                EstimatedSalary FLOAT,
                Geography_Germany INTEGER,
                Geography_Spain INTEGER,
                prediction INTEGER,
                probability FLOAT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        await db.commit()


async def get_db():
    async with aiosqlite.connect("models/predictions.db") as db:
        yield db


def startup_event(app: FastAPI):
    async def startup():
        await init_db()
    app.add_event_handler("startup", startup)
