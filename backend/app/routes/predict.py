from fastapi import APIRouter
from app.models.lstm_model import predict_glucose, predict_future
from app.utils.helpers import get_risk, user_average, personalize, minutes_since
from app.routes.meal import get_last_meal

router = APIRouter()

def adjust_for_meal(pred):
    last_meal = get_last_meal()
    if not last_meal:
        return pred

    mins = minutes_since(last_meal["time"])

    if mins < 120:
        return pred + 5
    elif mins > 240:
        return pred - 5

    return pred

@router.post("/predict")
def predict(data: dict):
    sequence = data["sequence"]

    if len(sequence) < 10:
        return {"error": "Insufficient data"}

    pred = predict_glucose(sequence)

    avg = user_average(sequence)
    pred = personalize(pred, avg)

    pred = adjust_for_meal(pred)

    future = predict_future(sequence)

    return {
        "predicted_glucose": pred,
        "future_values": future,
        "risk": get_risk(pred)
    }