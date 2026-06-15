from pydantic import BaseModel

class RegisterRequest(BaseModel):
    email: str
    phone: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str