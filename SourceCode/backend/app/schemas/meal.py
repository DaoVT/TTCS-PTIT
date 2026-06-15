from pydantic import BaseModel


class FoodItem(BaseModel):

    food_id: int

    quantity: float


class MealCreate(BaseModel):

    meal_type: str

    foods: list[FoodItem]