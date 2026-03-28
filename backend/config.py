# config.py
import os

# Đưa biến ra ngoài cùng của file
SECRET_KEY = "nutrition_secret_key_cua_ban"

# Các cấu hình khác cho MySQL
SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:password@localhost:1234/NutritionApp"