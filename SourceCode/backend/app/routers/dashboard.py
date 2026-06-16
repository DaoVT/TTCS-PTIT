from app.routers import profile
from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from sqlalchemy import func
from datetime import date
from app.models.meal import Meal
from app.models.food import Food
from app.models.nutrition_log import NutritionLog

from app.dependencies import get_db
from app.auth import get_current_user

from app.models.user import User
from app.models.health_profile import HealthProfile

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("")
def dashboard(
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
    if profile is None:

        return {
            "message": "Profile not setup",
            "profile_completed": False
        }
    nutrition = (
        db.query(
            func.sum(
                (
                    Food.calories *
                    NutritionLog.quantity
                )
                /
                Food.serving_size
            ).label("calories"),

            func.sum(
                (
                    Food.protein *
                    NutritionLog.quantity
                )
                /
                Food.serving_size
            ).label("protein"),

            func.sum(
                (
                        Food.carbs *
                    NutritionLog.quantity
                )
                /
                Food.serving_size
            ).label("carbs"),

            func.sum(
                (
                    Food.fat *
                    NutritionLog.quantity
                )
                /
                Food.serving_size
            ).label("fat")
        )
        .join(
            NutritionLog,
            Food.id == NutritionLog.food_id
        )
        .join(
            Meal,
            Meal.id == NutritionLog.meal_id
        )
        .filter(
            Meal.user_id == current_user.id,
            Meal.meal_date == date.today()
        )
        .first()
    )
    consumed_calories = (
        nutrition.calories or 0
    )

    protein = (
        nutrition.protein or 0
    )

    carbs = (
        nutrition.carbs or 0
    )

    fat = (
        nutrition.fat or 0
    )

    total_macros = (
        protein +
        carbs +
        fat
    )

    protein_percent = (
        protein / total_macros * 100
        if total_macros > 0
        else 0
    )

    carbs_percent = (
        carbs / total_macros * 100
        if total_macros > 0
        else 0
    )

    fat_percent = (
        fat / total_macros * 100
        if total_macros > 0
        else 0
    )

    goal_calories = (
        profile.daily_target_calories
    )

    remaining_calories = (
        goal_calories
        - consumed_calories
    )

    return {
        "user": {
            "id": current_user.id,
            "email": current_user.email
        },

        "health": {
            "age": profile.age,
            "gender": profile.gender,
            "height_cm": profile.height_cm,
            "weight_kg": float(profile.weight_kg),
            "bmi": float(profile.bmi),
            "bmr": float(profile.bmr),
            "tdee": float(profile.tdee)
        },

        "nutrition": {

            "goal_calories":
                round(goal_calories, 0),

            "consumed_calories":
                round(consumed_calories, 0),

            "remaining_calories":
                round(remaining_calories, 0),

            "protein":
                round(protein, 1),

            "carbs":
                round(carbs, 1),

            "fat":
                round(fat, 1),

            "protein_percent":
                round(protein_percent, 1),

            "carbs_percent":
                round(carbs_percent, 1),

            "fat_percent":
                round(fat_percent, 1)
        }
    }