from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.dependencies import get_db

from app.models.food import Food

router = APIRouter(
    prefix="/foods",
    tags=["Foods"]
)

@router.get("")
def get_foods(
    db: Session = Depends(get_db)
):

    foods = (
        db.query(Food)
        .all()
    )

    return foods