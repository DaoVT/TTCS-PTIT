import joblib
import pandas as pd

from sklearn.linear_model import LinearRegression

data = pd.DataFrame({

    "calorie_difference": [
        -800,
        -600,
        -400,
        -200,
        0,
        200,
        400,
        600,
        800
    ],

    "weight_change": [
        -0.8,
        -0.6,
        -0.4,
        -0.2,
        0,
        0.2,
        0.4,
        0.6,
        0.8
    ]

})

X = data[[
    "calorie_difference"
]]

y = data[
    "weight_change"
]

model = LinearRegression()

model.fit(
    X,
    y
)

joblib.dump(
    model,
    "app/ml/weight_model.pkl"
)

print(
    "Model trained successfully"
)