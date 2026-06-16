import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AICoach() {

const navigate =
    useNavigate();

const [meal, setMeal] =
    useState(null);

const [loading, setLoading] =
    useState(false);

const suggestMeal =
    async () => {

        try {

            setLoading(true);

            const response =
                await api.post(
                    "/ai/meal-suggestion"
                );

            setMeal(
                response.data
            );

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

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
            🤖 AI Coach
        </h2>

        <div
            className="
            bg-gray-100
            rounded-xl
            p-4
            mb-6
            min-h-[220px]
            "
        >

            {
                meal

                ?

                <>

                    <div
                        className="
                        flex
                        justify-between
                        mb-4
                        "
                    >

                        <span
                            className="
                            bg-green-100
                            text-green-700
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            "
                        >
                            Goal:
                            {" "}
                            {meal.goal}
                        </span>

                        <span
                            className="
                            bg-blue-100
                            text-blue-700
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            "
                        >
                            Score:
                            {" "}
                            {meal.meal_score}/100
                        </span>

                    </div>

                    <p
                        className="
                        mb-3
                        "
                    >
                        Remaining Calories:
                        {" "}
                        <b>
                            {meal.remaining_calories}
                        </b>
                        {" "}
                        kcal
                    </p>

                    {
                        meal.foods?.map(
                            (
                                food,
                                index
                            ) => (

                                <div
                                    key={index}
                                    className="
                                    bg-white
                                    border
                                    rounded-xl
                                    p-3
                                    mb-3
                                    "
                                >

                                    <div
                                        className="
                                        font-semibold
                                        "
                                    >
                                        🍽 {food.name}
                                    </div>

                                    <div
                                        className="
                                        text-sm
                                        text-gray-500
                                        "
                                    >
                                        {food.quantity}
                                        {" "}
                                        {food.unit}
                                    </div>

                                    <div
                                        className="
                                        text-green-600
                                        "
                                    >
                                        {food.calories}
                                        kcal
                                    </div>

                                </div>

                            )
                        )
                    }

                    <div
                        className="
                        mt-4
                        bg-green-50
                        p-3
                        rounded-xl
                        "
                    >

                        Total Calories:
                        {" "}
                        <b>
                            {meal.total_calories}
                        </b>
                        {" "}
                        kcal

                    </div>

                    <div
                        className="
                        mt-4
                        bg-yellow-50
                        border
                        border-yellow-200
                        p-3
                        rounded-xl
                        "
                    >

                        💡
                        {" "}
                        {meal.explanation}

                    </div>

                </>

                :

                <div
                    className="
                    text-gray-500
                    "
                >
                    Click Suggest Meal to get
                    a personalized meal plan.
                </div>

            }

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
                disabled={
                    loading
                }
                className="
                w-full
                bg-green-500
                hover:bg-green-600
                text-white
                p-3
                rounded-xl
                "
            >

                {
                    loading

                    ?

                    "Generating..."

                    :

                    meal

                    ?

                    "🍽 Suggest Another Meal"

                    :

                    "🍽 Suggest Meal"
                }

            </button>

            <button
                onClick={() =>
                    navigate(
                        "/predict-weight"
                    )
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
