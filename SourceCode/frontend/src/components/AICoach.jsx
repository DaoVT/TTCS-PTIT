import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AICoach() {
    const navigate =
        useNavigate();

    const [message, setMessage] =
        useState(
            "Hi! What can I help you with?"
        );

    const suggestMeal =
        async () => {

            const response =
                await api.post(
                    "/ai/meal-suggestion",
                    {
                        max_calories: 500
                    }
                );

            setMessage(
                response.data.foods.join(
                    ", "
                )
            );

        };

    return (

        <div
            className="
            bg-white
            rounded-2xl
            p-6
            shadow
            "
        >

            <h2
                className="
                text-2xl
                font-bold
                mb-6
                "
            >
                AI Coach
            </h2>

            <div
                className="
                bg-gray-100
                rounded-xl
                p-4
                mb-6
                min-h-[120px]
                "
            >
                {message}
            </div>

            <div
                className="
                space-y-3
                "
            >

                <button
                    onClick={
                        suggestMeal
                    }
                    className="
                    w-full
                    bg-green-500
                    text-white
                    p-3
                    rounded-xl
                    "
                >
                    🍽 Suggest Meal
                </button>

                <button
                    onClick={() =>
                        navigate("/predict-weight")
                    }
                    className="
                    w-full
                    bg-blue-500
                    text-white
                    p-3
                    rounded-xl
                    "
                >
                    📈 Predict Weight
                </button>

            </div>

        </div>

    );
}