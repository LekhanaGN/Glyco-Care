from fastapi import APIRouter, UploadFile, File
import pandas as pd
from app.models.lstm_model import predict_glucose, predict_future
from app.utils.helpers import get_risk

router = APIRouter()

@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)

    glucose = df["glucose"].dropna().tolist()

    if len(glucose) < 10:
        return {"error": "Insufficient data"}

    sequence = glucose[-10:]

    pred = predict_glucose(sequence)
    future = predict_future(sequence)

    return {
        "predicted_glucose": pred,
        "future_values": future,
        "risk": get_risk(pred)
    }