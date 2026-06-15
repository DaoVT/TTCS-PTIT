from sqlalchemy import Column
from sqlalchemy import BigInteger
from sqlalchemy import String
from sqlalchemy import Date
from sqlalchemy import DateTime
from sqlalchemy.sql import func

from app.database import Base


class Meal(Base):

    __tablename__ = "meals"

    id = Column(
        BigInteger,
        primary_key=True
    )

    user_id = Column(
        BigInteger,
        nullable=False
    )

    meal_type = Column(
        String(20),
        nullable=False
    )

    meal_date = Column(
        Date,
        nullable=False
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )