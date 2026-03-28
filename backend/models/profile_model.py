from database import db

class Profile(db.Model):
    __tablename__ = 'health_profiles'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    gender = db.Column(db.String(10)) 
    age = db.Column(db.Integer)
    height = db.Column(db.Float)
    initial_weight = db.Column(db.Float)
    activity_level_id = db.Column(db.Integer) # Có thể liên kết với bảng activity_levels