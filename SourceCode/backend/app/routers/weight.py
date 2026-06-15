from datetime import date

from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.schemas.weight import WeightCreate

from app.dependencies import get_db
from app.auth import get_current_user

from app.models.user import User
from app.models.weight_record import WeightRecord

router = APIRouter(
    prefix="/weight",
    tags=["Weight"]
)

@router.post("")
def add_weight(
    payload: WeightCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    record = WeightRecord(
        user_id=current_user.id,
        weight_kg=payload.weight_kg,
        record_date=date.today()
    )

    db.add(record)

    db.commit()

    return {
        "message": "Weight saved"
    }

@router.get("/history")
def get_weight_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    records = (
        db.query(WeightRecord)
        .filter(
            WeightRecord.user_id == current_user.id
        )
        .order_by(
            WeightRecord.record_date.asc()
        )
        .all()
    )

    return [
        {
            "date": record.record_date,
            "weight_kg": float(record.weight_kg)
        }
        for record in records
    ]