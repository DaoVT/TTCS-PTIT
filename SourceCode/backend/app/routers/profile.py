from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.schemas.profile import ProfileSetupRequest
from app.dependencies import get_db
from app.auth import get_current_user

from app.models.health_profile import HealthProfile
from app.models.user_diet_preference import UserDietPreference

from app.models.user import User

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)

@router.post("/setup")
def setup_profile(
    payload: ProfileSetupRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # BMI
    height_m = payload.height_cm / 100

    bmi = (
        payload.weight_kg /
        (height_m * height_m)
    )

    # BMR
    if payload.gender == "male":

        bmr = (
            10 * payload.weight_kg
            + 6.25 * payload.height_cm
            - 5 * payload.age
            + 5
        )

    else:

        bmr = (
            10 * payload.weight_kg
            + 6.25 * payload.height_cm
            - 5 * payload.age
            - 161
        )

    # Activity Factor
    activity_factors = {
        1: 1.20,
        2: 1.375,
        3: 1.55,
        4: 1.725
    }

    factor = activity_factors.get(
        payload.activity_level_id,
        1.20
    )

    # TDEE
    tdee = bmr * factor

    # Goal
    if payload.goal == "lose_weight":

        target_calories = tdee - 500

    elif payload.goal == "gain_muscle":

        target_calories = tdee + 300

    else:

        target_calories = tdee

    profile = (
        db.query(HealthProfile)
        .filter(
            HealthProfile.user_id == current_user.id
        )
        .first()
    )

    if profile is None:

        profile = HealthProfile(
            user_id=current_user.id
        )

        db.add(profile)

    profile.gender = payload.gender

    profile.age = payload.age

    profile.height_cm = payload.height_cm

    profile.weight_kg = payload.weight_kg

    profile.activity_level_id = payload.activity_level_id

    profile.goal = payload.goal

    profile.bmi = round(bmi, 2)

    profile.bmr = round(bmr, 2)

    profile.tdee = round(tdee, 2)

    profile.daily_target_calories = round(
        target_calories,
        2
    )

    profile.profile_completed = True

    db.commit()

    return {
    "message": "Profile setup completed",
    "profile_completed": True
    }


@router.get("")
def get_profile(
    current_user: User =
    Depends(
        get_current_user
    ),
    db: Session =
    Depends(get_db)
):

    profile = (
        db.query(
            HealthProfile
        )
        .filter(
            HealthProfile.user_id == current_user.id
        )
        .first()
    )

    if profile is None:
        return {
            "profile_completed": False,
        }
    return {
        "profile_completed": True,

        "age": profile.age,

        "gender": profile.gender,

        "height_cm": profile.height_cm,

        "weight_kg": float(profile.weight_kg),

        "activity_level_id":
            profile.activity_level_id,

        "goal": profile.goal
    }
    