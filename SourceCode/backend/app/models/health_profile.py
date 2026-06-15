from sqlalchemy import (
    Column,
    BigInteger,
    Integer,
    String,
    Boolean,
    DECIMAL
)

from app.database import Base


class HealthProfile(Base):

    __tablename__ = "health_profiles"

    id = Column(BigInteger, primary_key=True)

    user_id = Column(
        BigInteger,
        unique=True,
        nullable=False
    )

    gender = Column(
        String(10),
        nullable=False
    )

    age = Column(
        Integer,
        nullable=False
    )

    height_cm = Column(
        DECIMAL(5,2),
        nullable=False
    )

    weight_kg = Column(
        DECIMAL(5,2),
        nullable=False
    )

    activity_level_id = Column(
        Integer,
        nullable=False
    )

    goal = Column(
        String(50),
        nullable=False
    )

    bmi = Column(
        DECIMAL(5,2)
    )

    bmr = Column(
        DECIMAL(10,2)
    )

    tdee = Column(
        DECIMAL(10,2)
    )

    daily_target_calories = Column(
        Integer
    )

    profile_completed = Column(
        Boolean,
        default=False
    )