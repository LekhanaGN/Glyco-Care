import os

print("CURRENT FILE:", __file__)
print("FILES IN BACKEND:", os.listdir(os.path.dirname(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import os

app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Get correct backend path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_model(filename):
    path = os.path.join(BASE_DIR, filename)
    print("Loading model from:", path)  # debug
    if not os.path.exists(path):
        raise FileNotFoundError(f"{filename} NOT FOUND at {path}")
    return joblib.load(path)

# ✅ FIXED loading
log_model = load_model("log_model.pkl")
rf_model = load_model("rf_model.pkl")


@app.get("/")
def home():
    return {"message": "API is running"}


@app.post("/predict")
def predict(data: dict):
    try:
        features = np.array(data["features"]).reshape(1, -1)

        risk = int(log_model.predict(features)[0])
        glucose = float(rf_model.predict(features)[0])

        return {
            "risk": risk,
            "glucose": glucose
        }

    except Exception as e:
        return {"error": str(e)}