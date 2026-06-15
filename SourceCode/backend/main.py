from fastapi import FastAPI
from app.routers.auth import router as auth_router
from app.routers.profile import router as profile_router
from app.routers.dashboard import router as dashboard_router
from app.routers.meals import router as meals_router
from app.routers.weight import router as weight_router
from app.routers.ai import router as ai_router
from fastapi.middleware.cors import CORSMiddleware
from app.routers.foods import router as foods_router

app = FastAPI()

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(ai_router)
app.include_router(foods_router)
app.include_router(dashboard_router)
app.include_router(meals_router)
app.include_router(weight_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Nutrition API Running"
    }