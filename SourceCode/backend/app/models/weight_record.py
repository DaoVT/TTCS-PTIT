from sqlalchemy import Column
from sqlalchemy import BigInteger
from sqlalchemy import DECIMAL
from sqlalchemy import Date
from sqlalchemy import DateTime
from sqlalchemy.sql import func

from app.database import Base


class WeightRecord(Base):

    __tablename__ = "weight_records"

    id = Column(
        BigInteger,
        primary_key=True
    )

    user_id = Column(
        BigInteger,
        nullable=False
    )

    weight_kg = Column(
        DECIMAL(5,2),
        nullable=False
    )

    record_date = Column(
        Date,
        nullable=False
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )