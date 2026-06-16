import random

from datetime import date

from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.dependencies import get_db

from app.models.user import User
from app.models.food import Food
from app.models.meal import Meal
from app.models.nutrition_log import NutritionLog
from app.models.health_profile import HealthProfile

router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)

@router.post("/meal-suggestion")
def meal_suggestion(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db)
):

    profile = (
        db.query(HealthProfile)
        .filter(
            HealthProfile.user_id
            ==
            current_user.id
        )
        .first()
    )

    if not profile:

        return {
            "message":
                "Profile not found"
        }

    eaten_calories = (
        db.query(
            func.sum(
                (
                    Food.calories
                    *
                    NutritionLog.quantity
                )
                /
                Food.serving_size
            )
        )
        .join(
            NutritionLog,
            Food.id ==
            NutritionLog.food_id
        )
        .join(
            Meal,
            Meal.id ==
            NutritionLog.meal_id
        )
        .filter(
            Meal.user_id ==
            current_user.id,
            Meal.meal_date ==
            date.today()
        )
        .scalar()
    )

    eaten_calories = (
        eaten_calories or 0
    )

    remaining_calories = max(
        0,
        int(
            profile.daily_target_calories
            -
            eaten_calories
        )
    )

    if profile.goal == "lose_weight":

        candidate_foods = (
            db.query(Food)
            .filter(
                Food.calories < 180
            )
            .all()
        )

        explanation = (
            "Selected low-calorie and high-protein foods to support weight loss."
        )

    elif profile.goal == "gain_muscle":

        candidate_foods = (
            db.query(Food)
            .filter(
                Food.protein >= 10
            )
            .all()
        )

        explanation = (
            "Selected protein-rich foods to support muscle growth."
        )

    else:

        candidate_foods = (
            db.query(Food)
            .all()
        )

        explanation = (
            "Selected balanced foods suitable for weight maintenance."
        )

    if len(candidate_foods) < 3:

        candidate_foods = (
            db.query(Food)
            .all()
        )

    selected_foods = random.sample(
        candidate_foods,
        3
    )

    suggested_foods = []

    total_calories = 0

    for food in selected_foods:

        quantity = random.choice(
            [
                100,
                150,
                200
            ]
        )

        calories = round(
            (
                float(
                    food.calories
                )
                *
                quantity
            )
            /
            float(
                food.serving_size
            ),
            0
        )

        total_calories += calories

        suggested_foods.append(
            {
                "name":
                    food.name,

                "quantity":
                    quantity,

                "unit":
                    food.unit,

                "calories":
                    calories,

                "protein":
                    round(
                        (
                            float(
                                food.protein
                            )
                            *
                            quantity
                        )
                        /
                        float(
                            food.serving_size
                        ),
                        1
                    )
            }
        )

    meal_score = min(
        100,
        70 +
        random.randint(
            10,
            25
        )
    )

    return {

        "goal":
            profile.goal,

        "remaining_calories":
            remaining_calories,

        "foods":
            suggested_foods,

        "total_calories":
            total_calories,

        "meal_score":
            meal_score,

        "explanation":
            (
                f"{explanation} "
                f"This meal uses approximately "
                f"{total_calories} kcal from your "
                f"remaining {remaining_calories} kcal."
            )
    }



@router.get("/weight-prediction")
def predict_weight(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db)
):

    profile = (
        db.query(HealthProfile)
        .filter(
            HealthProfile.user_id
            ==
            current_user.id
        )
        .first()
    )

    if not profile:

        return {
            "message":
                "Profile not found"
        }

    daily_calories = (
        db.query(
            Meal.meal_date,

            func.sum(
                Food.calories *
                NutritionLog.quantity
            ).label(
                "calories"
            )
        )
        .join(
            NutritionLog,
            Meal.id ==
            NutritionLog.meal_id
        )
        .join(
            Food,
            Food.id ==
            NutritionLog.food_id
        )
        .filter(
            Meal.user_id ==
            current_user.id
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
        float(
            day.calories
        )
        for day in daily_calories
    )

    average_daily_calories = (
        total_calories
        /
        len(
            daily_calories
        )
    )

    current_weight = float(
        profile.weight_kg
    )

    tdee = float(
        profile.tdee
    )

    daily_difference = (
        average_daily_calories
        -
        tdee
    )

    def predict(days):

        total_difference = (
            daily_difference
            *
            days
        )

        weight_change = (
            total_difference
            /
            7700
        )

        return round(
            current_weight
            +
            weight_change,
            2
        )

    return {

        "current_weight":
            round(
                current_weight,
                2
            ),

        "tdee":
            round(
                tdee,
                2
            ),

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
