from pydantic import BaseModel

class ProfileSetupRequest(BaseModel):
    gender: str
    age: int
    height_cm: float
    weight_kg: float

    activity_level_id: int

    goal: str

    diet_preferences: list[int]