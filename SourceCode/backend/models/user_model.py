from database import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    
    # Quan hệ
    profile = db.relationship('Profile', backref='user', uselist=False, cascade="all, delete-orphan")
    meals = db.relationship('Meal', backref='user', lazy=True)
    predictions = db.relationship('Prediction', backref='user', lazy=True)