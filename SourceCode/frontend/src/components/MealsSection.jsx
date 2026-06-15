import { useEffect, useState } from "react";
import api from "../services/api";

export default function MealsSection({ refreshDashboard }) {
    const [meals, setMeals] =
        useState([]);


    const loadMeals = async () => {

        try {

            const token =
                localStorage.getItem(
                    "token"
                );

            const response =
                await api.get(
                    "/meals/today",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            setMeals(
                response.data
            );

        } catch (error) {

            console.log(error);

        }

    };

// Lưa meal mới
    const saveMeal = async () => {
        if (!foodId) {
            alert(
                "Please select a food"
            );
            return;
        }
        try {

            const token =
                localStorage.getItem(
                    "token"
                );

            await api.post(
                "/meals",
                {
                    meal_type:
                        mealType,

                    foods: [
                        {
                            food_id:
                                Number(
                                    foodId
                                ),

                            quantity:
                                Number(
                                    quantity
                                )
                        }
                    ]
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setMealType(
                "breakfast"
            );

            setFoodId("");

            setQuantity(100);

            await loadMeals();

            await refreshDashboard();

            setShowForm(false);

        } catch (error) {

            console.log(error);

        }

    };
    const [showForm, setShowForm] =
        useState(false);

    const [foods, setFoods] =
        useState([]);

    const [mealType, setMealType] =
        useState("breakfast");

    const [foodId, setFoodId] =
        useState("");

    const selectedFood =
    foods.find(
        (food) =>
            food.id === Number(foodId)
    );

    const [quantity, setQuantity] =
        useState(100);

    const loadFoods = async () => {

        try {

            const response =
                await api.get(
                    "/foods"
                );

            setFoods(
                response.data
            );

        } catch (error) {

            console.log(error);

        }
    };

    const calories =
        selectedFood
            ? (
                selectedFood.calories
                * quantity
                / selectedFood.serving_size
            ).toFixed(1)
            : 0;

    const protein =
        selectedFood
            ? (
                selectedFood.protein
                * quantity
                / selectedFood.serving_size
            ).toFixed(1)
            : 0;

    const carbs =
        selectedFood
            ? (
                selectedFood.carbs
                * quantity
                / selectedFood.serving_size
            ).toFixed(1)
            : 0;

    const fat =
        selectedFood
            ? (
                selectedFood.fat
                * quantity
                / selectedFood.serving_size
            ).toFixed(1)
            : 0;

        useEffect(() => {

        loadMeals();
        loadFoods();

    }, []);

//Xóa meal
    const deleteMeal = async (
        mealId
    ) => {

        try {

            if (
                !window.confirm(
                    "Delete this meal?"
                )
            ) {
                return;
            }

            const token =
                localStorage.getItem(
                    "token"
                );

            await api.delete(
                `/meals/${mealId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            await loadMeals();

            await refreshDashboard();

        } catch (error) {

            console.log(error);

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

            <div
                className="
                flex
                justify-between
                items-center
                mb-6
                "
            >

                <h2
                    className="
                    text-2xl
                    font-bold
                    "
                >
                    Today's Meals
                </h2>

                <button
                    onClick={() =>
                        setShowForm(true)
                    }
                    className="
                    bg-green-500
                    text-white
                    px-4
                    py-2
                    rounded-lg
                    "
                >
                    + Add Meal
                </button>

            </div>

            <div
                className="
                space-y-4
                "
            >
                {
                    meals.length === 0 &&
                    (
                        <div
                            className="
                            text-center
                            text-gray-500
                            py-10
                            "
                        >
                            No meals today
                        </div>
                    )
                }
                {
                             meals.map(
                        (meal) => (

                            <div
                                key={meal.meal_id}
                                className="
                                border
                                rounded-xl
                                p-4
                                flex
                                justify-between
                                items-center
                                "
                            >

                                <div>

                                    <p
                                        className="
                                        font-semibold
                                        capitalize
                                        "
                                    >
                                        {meal.meal_type}
                                    </p>

                                    <p
                                        className="
                                        text-sm
                                        text-gray-500
                                        "
                                    >
                                        Meal Entry
                                    </p>

                                </div>

                                <div
                                    className="
                                    flex
                                    items-center
                                    gap-4
                                    "
                                >

                                    <div
                                        className="
                                        font-bold
                                        text-green-500
                                        "
                                    >
                                       {
                                            Number(
                                                meal.calories
                                            ).toFixed(0)
                                        }
                                        kcal
                                    </div>

                                    <button
                                        onClick={() =>
                                            deleteMeal(
                                                meal.meal_id
                                            )
                                        }
                                        className="
                                        px-3
                                        py-1
                                        bg-red-100
                                        text-red-600
                                        rounded-lg
                                        hover:bg-red-200
                                        "
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>
                        )
                     )
                }

            </div>
                {
                showForm && (

                <div
                    className="
                    fixed
                    inset-0
                    bg-black/30
                    backdrop-blur-sm
                    flex
                    items-center
                    justify-center
                    z-50
                    "
                >

                    <div
                        className="
                        bg-white
                        rounded-3xl
                        shadow-2xl
                        p-8
                        w-[550px]
                        "
                    >

                        <div
                            className="
                            flex
                            justify-between
                            items-center
                            mb-6
                            "
                        >

                            <h2
                                className="
                                text-2xl
                                font-bold
                                text-gray-800
                                "
                            >
                                Add Meal
                            </h2>

                            <button
                                onClick={() =>
                                    setShowForm(false)
                                }
                                className="
                                text-gray-400
                                hover:text-gray-600
                                text-xl
                                "
                            >
                                ✕
                            </button>

                        </div>

                        <div className="space-y-5">

                            <div>

                                <label
                                    className="
                                    block
                                    mb-2
                                    font-medium
                                    text-gray-700
                                    "
                                >
                                    Meal Type
                                </label>

                                <select
                                    value={mealType}
                                    onChange={(e) =>
                                        setMealType(
                                            e.target.value
                                        )
                                    }
                                    className="
                                    w-full
                                    border
                                    border-gray-200
                                    rounded-xl
                                    p-3
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-green-400
                                    "
                                >
                                    <option value="breakfast">
                                        Breakfast
                                    </option>

                                    <option value="lunch">
                                        Lunch
                                    </option>

                                    <option value="dinner">
                                        Dinner
                                    </option>

                                    <option value="snack">
                                        Snack
                                    </option>

                                </select>

                            </div>

                            <div>

                                <label
                                    className="
                                    block
                                    mb-2
                                    font-medium
                                    text-gray-700
                                    "
                                >
                                    Food
                                </label>

                                <select
                                    value={foodId}
                                    onChange={(e) =>
                                        setFoodId(
                                            e.target.value
                                        )
                                    }
                                    className="
                                    w-full
                                    border
                                    border-gray-200
                                    rounded-xl
                                    p-3
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-green-400
                                    "
                                >

                                    <option value="">
                                        Select food...
                                    </option>

                                    {
                                        foods.map(
                                            (food) => (

                                                <option
                                                    key={food.id}
                                                    value={food.id}
                                                >
                                                    {food.name}
                                                </option>

                                            )
                                        )
                                    }

                                </select>

                            </div>

                            <div>

                                <label
                                    className="
                                    block
                                    mb-2
                                    font-medium
                                    text-gray-700
                                    "
                                >
                                    Quantity (g)
                                </label>

                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(
                                            e.target.value
                                        )
                                    }
                                    className="
                                    w-full
                                    border
                                    border-gray-200
                                    rounded-xl
                                    p-3
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-green-400
                                    "
                                />

                            </div>

                            <div
                                className="
                                bg-green-50
                                rounded-2xl
                                p-4
                                "
                            >

                                <p
                                    className="
                                    text-sm
                                    text-gray-500
                                    mb-2
                                    "
                                >
                                    Nutrition Preview
                                </p>

                                <div
                                    className="
                                    grid
                                    grid-cols-2
                                    gap-3
                                    "
                                >

                                <div>
                                    Calories:
                                    {" "}
                                    <span className="font-semibold">
                                        {calories}
                                    </span>
                                </div>

                                <div>
                                    Protein:
                                    {" "}
                                    <span className="font-semibold">
                                        {protein} g
                                    </span>
                                </div>

                                <div>
                                    Carbs:
                                    {" "}
                                    <span className="font-semibold">
                                        {carbs} g
                                    </span>
                                </div>

                                <div>
                                    Fat:
                                    {" "}
                                    <span className="font-semibold">
                                        {fat} g
                                    </span>
                                </div>

                                </div>

                            </div>

                            <div
                                className="
                                flex
                                gap-3
                                pt-2
                                "
                            >

                                <button
                                    onClick={saveMeal}
                                    className="
                                    flex-1
                                    bg-green-500
                                    hover:bg-green-600
                                    text-white
                                    py-3
                                    rounded-xl
                                    font-semibold
                                    "
                                >
                                    Save Meal
                                </button>

                                <button
                                    onClick={() =>
                                        setShowForm(false)
                                    }
                                    className="
                                    flex-1
                                    bg-gray-100
                                    hover:bg-gray-200
                                    text-gray-700
                                    py-3
                                    rounded-xl
                                    font-semibold
                                    "
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

                )
                }
        </div>

    );
}