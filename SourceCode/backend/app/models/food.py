from sqlalchemy import Column
from sqlalchemy import BigInteger
from sqlalchemy import String
from sqlalchemy import DECIMAL

from app.database import Base


class Food(Base):

    __tablename__ = "foods"

    id = Column(
        BigInteger,
        primary_key=True
    )

    name = Column(
        String(255)
    )

    serving_size = Column(
        DECIMAL(10,2)
    )

    unit = Column(
        String(20)
    )

    calories = Column(
        DECIMAL(10,2)
    )

    protein = Column(
        DECIMAL(10,2)
    )

    carbs = Column(
        DECIMAL(10,2)
    )

    fat = Column(
        DECIMAL(10,2)
    )