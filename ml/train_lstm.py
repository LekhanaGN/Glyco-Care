import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

def generate_data(n=400):
    x = np.linspace(0, 50, n)
    return 100 + 20*np.sin(x) + np.random.normal(0, 3, n)

data = generate_data()

def create_sequences(data, seq_length=10):
    X, y = [], []
    for i in range(len(data) - seq_length):
        X.append(data[i:i+seq_length])
        y.append(data[i+seq_length])
    return np.array(X), np.array(y)

X, y = create_sequences(data)
X = X.reshape((X.shape[0], X.shape[1], 1))

model = Sequential([
    LSTM(64, activation='relu', input_shape=(10,1)),
    Dense(1)
])

model.compile(optimizer='adam', loss='mse')
model.fit(X, y, epochs=10)

model.save("ml/model.h5")