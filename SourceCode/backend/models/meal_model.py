from database import db
from datetime import datetime

class Meal(db.Model):
    __tablename__ = 'meals'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    meal_type = db.Column(db.String(20)) # sáng, trưa, tối
    log_date = db.Column(db.Date, default=datetime.utcnow().date)
    
    # Nếu bạn có bảng chi tiết thực phẩm (NutritionLog), hãy khai báo ở đây
    # nutrition_details = db.relationship('NutritionLog', backref='meal')