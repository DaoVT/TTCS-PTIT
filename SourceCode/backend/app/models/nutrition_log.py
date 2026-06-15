from sqlalchemy import Column
from sqlalchemy import BigInteger
from sqlalchemy import DECIMAL
from sqlalchemy import DateTime
from sqlalchemy.sql import func

from app.database import Base


class NutritionLog(Base):

    __tablename__ = "nutrition_logs"

    id = Column(
        BigInteger,
        primary_key=True
    )

    meal_id = Column(
        BigInteger,
        nullable=False
    )

    food_id = Column(
        BigInteger,
        nullable=False
    )

    quantity = Column(
        DECIMAL(10,2),
        nullable=False
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )