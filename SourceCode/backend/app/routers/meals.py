from datetime import date

from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from sqlalchemy import func

from app.models.food import Food

from app.schemas.meal import MealCreate

from app.dependencies import get_db
from app.auth import get_current_user

from app.models.user import User
from app.models.meal import Meal
from app.models.nutrition_log import NutritionLog

router = APIRouter(
    prefix="/meals",
    tags=["Meals"]
)

@router.post("")
def create_meal(
    payload: MealCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    meal = Meal(
        user_id=current_user.id,
        meal_type=payload.meal_type,
        meal_date=date.today()
    )

    db.add(meal)

    db.flush()

    for item in payload.foods:

        log = NutritionLog(
            meal_id=meal.id,
            food_id=item.food_id,
            quantity=item.quantity
        )

        db.add(log)

    db.commit()

    return {
        "message": "Meal created",
        "meal_id": meal.id
    }

@router.get("/today")
def get_today_meals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    meals = (
        db.query(Meal)
        .filter(
            Meal.user_id == current_user.id,
            Meal.meal_date == date.today()
        )
        .all()
    )

    result = []

    for meal in meals:
        foods = (
            db.query(Food.name)
            .join(
                NutritionLog,
                Food.id == NutritionLog.food_id
            )
            .filter(
                NutritionLog.meal_id == meal.id
            )
            .all()
        )        
        food_names = [
            food.name
            for food in foods
        ]
        total_calories = (
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
                Food.id == NutritionLog.food_id
            )
            .filter(
                NutritionLog.meal_id == meal.id
            )
            .scalar()
        )

        result.append(
            {
                "meal_id": meal.id,
                "meal_type": meal.meal_type,
                "foods": food_names,
                "calories": total_calories or 0
            }
        )

    return result

@router.delete("/{meal_id}")
def delete_meal(
    meal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    meal = (
        db.query(Meal)
        .filter(
            Meal.id == meal_id,
            Meal.user_id == current_user.id
        )
        .first()
    )

    if not meal:

        return {
            "message": "Meal not found"
        }

    (
        db.query(NutritionLog)
        .filter(
            NutritionLog.meal_id == meal.id
        )
        .delete()
    )

    db.delete(meal)

    db.commit()

    return {
        "message": "Meal deleted"
    }