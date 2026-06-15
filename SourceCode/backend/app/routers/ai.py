from fastapi import APIRouter

from app.schemas.ai import MealSuggestionRequest

from sqlalchemy.orm import Session

from fastapi import Depends

from app.dependencies import get_db

from app.models.food import Food

from app.auth import get_current_user
from app.dependencies import get_db

from sqlalchemy.orm import Session
from fastapi import Depends

from app.models.user import User
from app.models.health_profile import HealthProfile

from sqlalchemy import func

from app.models.meal import Meal
from app.models.nutrition_log import NutritionLog

router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)

@router.post("/meal-suggestion")
def meal_suggestion(
    payload: MealSuggestionRequest,
    db: Session = Depends(get_db)
):

    foods = (
        db.query(Food)
        .order_by(Food.protein.desc())
        .all()
    )

    selected_foods = []

    total_calories = 0

    for food in foods:

        if (
            total_calories + food.calories
            <= payload.max_calories
        ):

            selected_foods.append(food)

            total_calories += food.calories

    return {

        "title": "AI Meal Suggestion",

        "calories": round(
            total_calories,
            2
        ),

        "foods": [
            food.name
            for food in selected_foods
        ]
    }

from sqlalchemy import func

from app.models.food import Food
from app.models.meal import Meal
from app.models.nutrition_log import NutritionLog
from app.models.health_profile import HealthProfile

from app.auth import get_current_user
from app.dependencies import get_db

from sqlalchemy.orm import Session

from fastapi import Depends


@router.get("/weight-prediction")
def predict_weight(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    profile = (
        db.query(HealthProfile)
        .filter(
            HealthProfile.user_id == current_user.id
        )
        .first()
    )

    if not profile:

        return {
            "message": "Profile not found"
        }

    daily_calories = (
        db.query(
            Meal.meal_date,

            func.sum(
                Food.calories *
                NutritionLog.quantity
            ).label("calories")
        )
        .join(
            NutritionLog,
            Meal.id == NutritionLog.meal_id
        )
        .join(
            Food,
            Food.id == NutritionLog.food_id
        )
        .filter(
            Meal.user_id == current_user.id
        )
        .group_by(
            Meal.meal_date
        )
        .all()
    )

    if not daily_calories:

        return {
            "message":
            "No meal data found"
        }

    total_calories = sum(
        float(day.calories)
        for day in daily_calories
    )

    average_daily_calories = (
        total_calories /
        len(daily_calories)
    )

    current_weight = float(
        profile.weight_kg
    )

    tdee = float(
        profile.tdee
    )

    daily_difference = (
        average_daily_calories -
        tdee
    )

    def predict(days):

        total_difference = (
            daily_difference *
            days
        )

        weight_change = (
            total_difference /
            7700
        )

        return round(
            current_weight +
            weight_change,
            2
        )

    return {

        "current_weight":
            round(current_weight, 2),

        "tdee":
            round(tdee, 2),

        "average_daily_calories":
            round(
                average_daily_calories,
                2
            ),

        "daily_difference":
            round(
                daily_difference,
                2
            ),

        "predictions": {

            "7_days":
                predict(7),

            "14_days":
                predict(14),

            "30_days":
                predict(30)
        }
    }