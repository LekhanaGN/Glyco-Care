from fastapi import APIRouter
import time

router = APIRouter()
meals = []

@router.post("/log-meal")
def log_meal(data: dict):
    meals.append({
        "carbs": data.get("carbs", 0),
        "time": time.time()
    })
    return {"message": "Meal logged"}

def get_last_meal():
    return meals[-1] if meals else None