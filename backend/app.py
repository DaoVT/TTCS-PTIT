from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import pymysql
import config

app = Flask(__name__)
app.secret_key = config.SECRET_KEY
CORS(app, 
     supports_credentials=True, 
     origins=["http://localhost:3000"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"])

app.config.update(
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=False 
)

# Hàm kết nối MySQL
def get_db_connection():
    return pymysql.connect(
        host='localhost',
        user='root',         # Thay bằng user của bạn
        password='1234', # Thay bằng password của bạn
        database='NutritionApp', # Tên database đã tạo
        cursorclass=pymysql.cursors.DictCursor
    )

@app.route("/check-login")
def check_login():
    user_id = session.get("user_id")
    return jsonify({"user_id": user_id})

@app.route("/")
def home():
    return "Nutrition Web Backend is running with MySQL"

# =========================
# ĐĂNG KÝ
# =========================
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Không nhận được dữ liệu"}), 400

    username, email, password = data.get("username"), data.get("email"), data.get("password")
    if not all([username, email, password]):
        return jsonify({"error": "Thiếu thông tin đăng ký"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Kiểm tra tồn tại (Sửa ? thành %s)
    cursor.execute("SELECT * FROM users WHERE username = %s OR email = %s", (username, email))
    existing_user = cursor.fetchone()

    if existing_user:
        conn.close()
        return jsonify({"error": "Tên đăng nhập hoặc email đã tồn tại"}), 400

    password_hash = generate_password_hash(password)
    cursor.execute(
        "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
        (username, email, password_hash)
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Đăng ký thành công"}), 201

# =========================
# ĐĂNG NHẬP
# =========================
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username, password = data.get("username"), data.get("password")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    conn.close()

    if user and check_password_hash(user["password_hash"], password):
        session["user_id"] = user["user_id"]
        return jsonify({"message": "Đăng nhập thành công", "user_id": user["user_id"]}), 200

    return jsonify({"error": "Sai tên đăng nhập hoặc mật khẩu"}), 401

# =========================
# ĐĂNG XUẤT
# =========================
@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Đăng xuất thành công"}), 200

# =========================
# THÔNG TIN CÁ NHÂN
# =========================
@app.route("/profile", methods=["GET"])
def get_profile():
    user_id = session.get("user_id")
    if not user_id: return jsonify({"error": "Chưa đăng nhập"}), 401

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT user_id, username, email, created_at FROM users WHERE user_id = %s", (user_id,))
    user = cursor.fetchone()
    conn.close()

    if not user: return jsonify({"error": "Không tìm thấy người dùng"}), 404
    return jsonify(user), 200

@app.route("/profile", methods=["PUT"])
def update_profile():
    user_id = session.get("user_id")
    if not user_id: return jsonify({"error": "Chưa đăng nhập"}), 401
    
    data = request.get_json()
    username, email = data.get("username"), data.get("email")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET username = %s, email = %s WHERE user_id = %s", (username, email, user_id))
    conn.commit()
    conn.close()
    return jsonify({"message": "Cập nhật thông tin cá nhân thành công"}), 200

# =========================
# THÔNG SỐ CƠ THỂ
# =========================
@app.route("/body-metrics", methods=["POST"])
def save_body_metrics():
    user_id = session.get("user_id")
    if not user_id: return jsonify({"error": "Chưa đăng nhập"}), 401

    data = request.get_json()
    fields = [data.get("gender"), data.get("age"), data.get("height_cm"), data.get("current_weight_kg"), data.get("activity_level_id")]
    if not all(fields): return jsonify({"error": "Thiếu thông số cơ thể"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM health_profiles WHERE user_id = %s", (user_id,))
    profile = cursor.fetchone()

    if profile:
        cursor.execute("""
            UPDATE health_profiles
            SET gender = %s, age = %s, height_cm = %s, current_weight_kg = %s, activity_level_id = %s, goal_calories = %s
            WHERE user_id = %s
        """, (data.get("gender"), data.get("age"), data.get("height_cm"), data.get("current_weight_kg"), data.get("activity_level_id"), data.get("goal_calories"), user_id))
    else:
        cursor.execute("""
            INSERT INTO health_profiles (user_id, gender, age, height_cm, current_weight_kg, activity_level_id, goal_calories)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (user_id, data.get("gender"), data.get("age"), data.get("height_cm"), data.get("current_weight_kg"), data.get("activity_level_id"), data.get("goal_calories")))

    conn.commit()
    conn.close()
    return jsonify({"message": "Lưu thông số cơ thể thành công"}), 200

@app.route("/body-metrics", methods=["GET"])
def get_body_metrics():
    user_id = session.get("user_id")
    if not user_id: return jsonify({"error": "Chưa đăng nhập"}), 401

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM v_body_metrics WHERE user_id = %s", (user_id,))
    result = cursor.fetchone()
    conn.close()

    if not result: return jsonify({"error": "Chưa có dữ liệu"}), 404
    return jsonify(result), 200

# =========================
# MÓN ĂN
# =========================
@app.route("/foods", methods=["GET"])
def get_foods():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM foods ORDER BY food_name")
    foods = cursor.fetchall()
    conn.close()
    return jsonify(foods), 200

@app.route("/foods", methods=["POST"])
def create_food():
    user_id = session.get("user_id")
    if not user_id: return jsonify({"error": "Chưa đăng nhập"}), 401
    
    data = request.get_json()
    food_name = data.get("food_name")
    p, c, f = float(data.get("protein_per_100g") or 0), float(data.get("carbs_per_100g") or 0), float(data.get("fat_per_100g") or 0)
    cal = round(p * 4 + c * 4 + f * 9, 2)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO foods (food_name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g) VALUES (%s, %s, %s, %s, %s)", 
                   (food_name, cal, p, c, f))
    conn.commit()
    food_id = cursor.lastrowid
    conn.close()
    return jsonify({"message": "Tạo món ăn thành công", "food_id": food_id}), 201

# =========================
# BỮA ĂN & LOGS (Sửa tương tự mẫu trên)
# =========================
@app.route("/meals", methods=["POST"])
def create_meal():
    user_id = session.get("user_id")
    if not user_id: return jsonify({"error": "Chưa đăng nhập"}), 401
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO meals (user_id, meal_date, meal_type, meal_time, note) VALUES (%s, %s, %s, %s, %s)",
                   (user_id, data.get("meal_date"), data.get("meal_type"), data.get("meal_time"), data.get("note")))
    conn.commit()
    meal_id = cursor.lastrowid
    conn.close()
    return jsonify({"meal_id": meal_id}), 201

@app.route("/nutrition-history", methods=["GET"])
def get_nutrition_history():
    user_id = session.get("user_id")
    if not user_id: return jsonify({"error": "Chưa đăng nhập"}), 401
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT m.meal_date, f.food_name, nl.quantity_g, nl.calories
        FROM nutrition_logs nl
        JOIN meals m ON nl.meal_id = m.meal_id
        JOIN foods f ON nl.food_id = f.food_id
        WHERE m.user_id = %s ORDER BY m.meal_date DESC
    """, (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return jsonify(rows), 200

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

if __name__ == "__main__":
    app.run(debug=True)