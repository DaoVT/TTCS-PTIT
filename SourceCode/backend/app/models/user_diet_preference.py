from sqlalchemy import Column
from sqlalchemy import BigInteger
from sqlalchemy import Integer

from app.database import Base


class UserDietPreference(Base):

    __tablename__ = "user_diet_preferences"

    user_id = Column(
        BigInteger,
        primary_key=True
    )

    preference_id = Column(
        Integer,
        primary_key=True
    )