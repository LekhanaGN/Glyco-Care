import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestRegressor
import joblib

# 🔹 Generate dummy training data
# features: [carbs, insulin, activity, time]
X = np.random.rand(200, 4)

# 🔹 Binary risk (0 = safe, 1 = risk)
y_risk = (X[:, 0] + X[:, 1] > 1).astype(int)

# 🔹 Glucose prediction (some realistic-ish function)
y_glucose = 80 + (X[:, 0] * 40) - (X[:, 1] * 20) + (X[:, 2] * 10)

# 🔹 Train models
log_model = LogisticRegression()
log_model.fit(X, y_risk)

rf_model = RandomForestRegressor()
rf_model.fit(X, y_glucose)

# 🔹 Save models
joblib.dump(log_model, "log_model.pkl")
joblib.dump(rf_model, "rf_model.pkl")

print("✅ Models trained and saved!")