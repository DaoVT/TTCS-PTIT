import pymysql
import config

def get_db_connection():
    # Kết nối tới MySQL thay vì SQLite
    connection = pymysql.connect(
        host='localhost',
        user='root',         # Tên user MySQL của bạn
        password='1234', # Mật khẩu MySQL của bạn
        database='NutritionApp',
        cursorclass=pymysql.cursors.DictCursor # Để trả về dạng dictionary giống user["email"]
    )
    return connection