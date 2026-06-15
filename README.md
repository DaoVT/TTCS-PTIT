# NutriCoach

NutriCoach là hệ thống hỗ trợ quản lý dinh dưỡng và theo dõi sức khỏe cá nhân được xây dựng bằng ReactJS và FastAPI.

## Features

* User Authentication (JWT)
* Health Profile Setup
* BMI, BMR, TDEE Calculation
* Meal Management
* Nutrition Tracking
* AI Meal Suggestions
* Weight Prediction
* Dashboard Analytics

## Tech Stack

### Frontend

* ReactJS
* Tailwind CSS
* Axios

### Backend

* FastAPI
* SQLAlchemy
* PostgreSQL
* JWT Authentication

## Installation

### Clone Repository

```bash
git clone https://github.com/DaoVT/TTCS-PTIT.git
```

### Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Author

DaoVT

Posts and Telecommunications Institute of Technology (PTIT)

2026
