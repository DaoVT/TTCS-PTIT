from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.auth import get_current_user

from app.models.user import User
from app.models.health_profile import HealthProfile

router = APIRouter(
    prefix="/prediction",
    tags=["Prediction"]
)

@router.get("/weight")
def predict_weight(
    weeks: int = 12,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    profile = (
        db.query(HealthProfile)
        .filter(
            HealthProfile.user_id ==
            current_user.id
        )
        .first()
    )

    current_weight = float(
        profile.weight_kg
    )

    predictions = []

    for week in range(weeks + 1):

        if profile.goal == "lose_weight":

            predicted = current_weight - (
                    week * 0.45
                )

        elif profile.goal == "gain_muscle":

            predicted = current_weight + (
                    week * 0.25
                )

        else:

            predicted = current_weight

        predictions.append(
            {
                "week":
                    f"Week {week}",

                "weight":
                    round(
                        predicted,
                        1
                    )
            }
        )

    return predictions