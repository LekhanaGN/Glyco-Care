import numpy as np
from tensorflow.keras.models import load_model

model = load_model("ml/model.h5")

def predict_glucose(sequence):
    seq = np.array(sequence).reshape(1, 10, 1)
    return float(model.predict(seq)[0][0])

def predict_future(sequence, steps=6):
    seq = np.array(sequence).reshape(1, 10, 1)
    future = []

    for _ in range(steps):
        pred = model.predict(seq)[0][0]
        future.append(float(pred))
        seq = np.append(seq[:,1:,:], [[[pred]]], axis=1)

    return future