from sqlalchemy import Column, BigInteger, String, DateTime
from sqlalchemy.sql import func

from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, index=True)

    email = Column(String(255), unique=True, nullable=False)

    phone = Column(String(20), unique=True, nullable=True)

    password_hash = Column(String(255), nullable=False)

    created_at = Column(
        DateTime,
        server_default=func.now()
    )