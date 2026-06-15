import {
    useState,
    useEffect
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ProfileSetup() {
    useEffect(() => {

        loadProfile();

    }, []);
    const navigate =
        useNavigate();

    const [form, setForm] =
        useState({
            age: "",
            gender: "",
            height_cm: "",
            weight_kg: "",
            activity_level_id: "",
            goal: "",
            diet_preferences: []
        });
    const loadProfile =
        async () => {

        try {

            const token =
                localStorage.getItem(
                    "token"
                );

            const response =
                await api.get(
                    "/profile",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            if (response.data) {

                setForm({

                    age:
                        response.data.age,

                    gender:
                        response.data.gender,

                    height_cm:
                        response.data.height_cm,

                    weight_kg:
                        response.data.weight_kg,

                    activity_level_id:
                        response.data.activity_level_id,

                    goal:
                        response.data.goal,
                    diet_preferences: []
                });
            }
        } catch (error) {

            console.log(form);

        }
    };
    const handleChange = (
        e
    ) => {

        setForm({
            ...form,
            [e.target.name]:
                e.target.value
        });
    };

    const saveProfile = async (
        e
    ) => {

        e.preventDefault();

        try {

            const token =
                localStorage.getItem(
                    "token"
                );
            console.log(form);
            await api.post(
                "/profile/setup",
                form,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            navigate(
                "/dashboard"
            );

        } catch (error) {

            console.log(error);

            alert(
                "Cannot save profile"
            );
        }
    };

    return (

        <div
            className="
            min-h-screen
            flex
            items-center
            justify-center
            bg-gradient-to-br
            from-green-100
            to-green-300
            px-4
            "
        >

            <div
                className="
                bg-white
                rounded-3xl
                shadow-xl
                p-10
                w-full
                max-w-2xl
                "
            >

                <div
                    className="
                    text-center
                    mb-8
                    "
                >

                    <h1
                        className="
                        text-4xl
                        font-bold
                        text-green-600
                        "
                    >
                        Complete Your Profile
                    </h1>

                    <p
                        className="
                        text-gray-500
                        mt-2
                        "
                    >
                        Let's calculate your
                        nutrition goals
                    </p>

                </div>

                <form
                    onSubmit={
                        saveProfile
                    }
                    className="
                    grid
                    grid-cols-2
                    gap-5
                    "
                >

                    <div>

                        <label>
                            Age
                        </label>

                        <input
                            type="number"
                            name="age"
                            value={form.age}
                            onChange={
                                handleChange
                            }
                            className="
                            w-full
                            border
                            rounded-xl
                            px-4
                            py-3
                            mt-2
                            "
                            required
                        />

                    </div>

                    <div>

                        <label>
                            Gender
                        </label>

                        <select
                            name="gender"
                            value={
                                form.gender
                            }
                            onChange={
                                handleChange
                            }
                            className="
                            w-full
                            border
                            rounded-xl
                            px-4
                            py-3
                            mt-2
                            "
                        >

                            <option value="male">
                                Male
                            </option>

                            <option value="female">
                                Female
                            </option>

                        </select>

                    </div>

                    <div>

                        <label>
                            Height (cm)
                        </label>

                        <input
                            type="number"
                            name="height_cm"
                            value={
                                form.height_cm
                            }
                            onChange={
                                handleChange
                            }
                            className="
                            w-full
                            border
                            rounded-xl
                            px-4
                            py-3
                            mt-2
                            "
                            required
                        />

                    </div>

                    <div>

                        <label>
                            Weight (kg)
                        </label>

                        <input
                            type="number"
                            name="weight_kg"
                            value={
                                form.weight_kg
                            }
                            onChange={
                                handleChange
                            }
                            className="
                            w-full
                            border
                            rounded-xl
                            px-4
                            py-3
                            mt-2
                            "
                            required
                        />

                    </div>

                    <div>

                        <label>
                            Activity Level
                        </label>

                        <select
                            name="activity_level"
                            value={
                                form.activity_level
                            }
                            onChange={
                                handleChange
                            }
                            className="
                            w-full
                            border
                            rounded-xl
                            px-4
                            py-3
                            mt-2
                            "
                        >

                            <option value="sedentary">
                                Sedentary
                            </option>

                            <option value="light">
                                Light
                            </option>

                            <option value="moderate">
                                Moderate
                            </option>

                            <option value="active">
                                Active
                            </option>

                            <option value="very_active">
                                Very Active
                            </option>

                        </select>

                    </div>

                    <div>

                        <label>
                            Goal
                        </label>

                        <select
                            name="goal"
                            value={
                                form.goal
                            }
                            onChange={
                                handleChange
                            }
                            className="
                            w-full
                            border
                            rounded-xl
                            px-4
                            py-3
                            mt-2
                            "
                        >

                            <option value="lose">
                                Lose Weight
                            </option>

                            <option value="maintain">
                                Maintain
                            </option>

                            <option value="gain">
                                Gain Weight
                            </option>

                        </select>

                    </div>

                    <div
                        className="
                        col-span-2
                        mt-4
                        "
                    >

                        <button
                            type="submit"
                            className="
                            w-full
                            bg-green-500
                            hover:bg-green-600
                            text-white
                            py-4
                            rounded-xl
                            font-semibold
                            "
                        >
                            Save Profile
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}
