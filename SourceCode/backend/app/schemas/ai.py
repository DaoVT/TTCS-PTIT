from pydantic import BaseModel

class MealSuggestionRequest(BaseModel):
    max_calories: int

