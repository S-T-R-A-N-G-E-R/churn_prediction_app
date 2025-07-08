import aiosqlite
from contextlib import asynccontextmanager

DATABASE_URL = "sqlite:///models/predictions.db"


@asynccontextmanager
async def get_db():
    db = await aiosqlite.connect("models/predictions.db")
    try:
        yield db
    finally:
        await db.close()
