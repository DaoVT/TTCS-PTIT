from pydantic import BaseModel


class WeightCreate(BaseModel):

    weight_kg: float