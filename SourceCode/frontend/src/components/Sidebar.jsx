import { useNavigate } from "react-router-dom";
export default function Sidebar({
    dashboard
}) {

    const navigate = useNavigate();

    if (!dashboard || !dashboard.health) {
        return null;
    }

    const health =
        dashboard.health;

    let bmiStatus = "";
    let bmiColor = "";

    if (health.bmi < 18.5) {
        bmiStatus = "Underweight";
        bmiColor = "bg-blue-500";
    }
    else if (health.bmi < 25) {
        bmiStatus = "Normal";
        bmiColor = "bg-green-500";
    }
    else if (health.bmi < 30) {
        bmiStatus = "Overweight";
        bmiColor = "bg-yellow-500";
    }
    else {
        bmiStatus = "Obese";
        bmiColor = "bg-red-500";
    }

    return (

        <div className="space-y-4">

            {/* User Card */}

            <div
                className="
                bg-green-50
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
                    NutriCoach AI
                </h2>

                <div
                    className="
                    grid
                    grid-cols-3
                    gap-3
                    "
                >

                    <div
                        className="
                        bg-white
                        rounded-xl
                        p-3
                        text-center
                        "
                    >
                        <p className="font-bold">
                            {health.weight_kg}
                        </p>

                        <p className="text-sm text-gray-500">
                            kg
                        </p>
                    </div>

                    <div
                        className="
                        bg-white
                        rounded-xl
                        p-3
                        text-center
                        "
                    >
                        <p className="font-bold">
                            {health.height_cm}
                        </p>

                        <p className="text-sm text-gray-500">
                            cm
                        </p>
                    </div>

                    <div
                        className="
                        bg-white
                        rounded-xl
                        p-3
                        text-center
                        "
                    >
                        <p className="font-bold">
                            {health.age}
                        </p>

                        <p className="text-sm text-gray-500">
                            tuổi
                        </p>
                    </div>

                </div>

            </div>

            {/* BMI Card */}

            <div
                className="
                bg-white
                rounded-2xl
                p-5
                shadow
                "
            >

                <h3
                    className="
                    font-bold
                    text-gray-700
                    mb-4
                    "
                >
                    BMI INDEX
                </h3>

                <div
                    className="
                    flex
                    justify-between
                    items-center
                    mb-4
                    "
                >

                    <div
                        className="
                        text-4xl
                        font-bold
                        "
                    >
                        {health.bmi}
                    </div>

                    <div
                        className={`
                            px-3
                            py-1
                            rounded-full
                            text-white
                            text-sm
                            ${bmiColor}
                        `}
                    >
                        {bmiStatus}
                    </div>

                </div>

                <div
                    className="
                    h-3
                    rounded-full
                    overflow-hidden
                    flex
                    "
                >

                    <div
                        className="
                        bg-blue-500
                        w-[20%]
                        "
                    />

                    <div
                        className="
                        bg-green-500
                        w-[30%]
                        "
                    />

                    <div
                        className="
                        bg-yellow-400
                        w-[25%]
                        "
                    />

                    <div
                        className="
                        bg-red-500
                        w-[25%]
                        "
                    />

                </div>

                <div
                    className="
                    relative
                    h-5
                    "
                >

                    <div
                        className="
                        absolute
                        w-4
                        h-4
                        bg-white
                        border-2
                        border-black
                        rounded-full
                        top-[-2px]
                        "
                        style={{
                            left: `${Math.min(
                                Math.max(
                                    (health.bmi / 40) * 100,
                                    0
                                ),
                                100
                            )}%`,
                            transform:
                                "translateX(-50%)"
                        }}
                    />

                </div>

                <div
                    className="
                    flex
                    justify-between
                    text-xs
                    text-gray-500
                    "
                >

                    <span>15</span>

                    <span>18.5</span>

                    <span>25</span>

                    <span>30</span>

                    <span>35</span>

                </div>

            </div>

            {/* Daily Targets */}

            <div
                className="
                bg-white
                rounded-2xl
                p-5
                shadow
                "
            >

                <h3
                    className="
                    font-bold
                    text-gray-700
                    mb-4
                    "
                >
                    DAILY TARGETS
                </h3>

                <div
                    className="
                    flex
                    justify-between
                    mb-3
                    "
                >

                    <span>
                        Daily TDEE
                    </span>

                    <span
                        className="
                        font-bold
                        "
                    >
                        {Math.round(
                            health.tdee
                        )} kcal
                    </span>

                </div>

                <hr className="my-3" />

                <div
                    className="
                    flex
                    justify-between
                    mb-4
                    "
                >

                    <span>
                        Target
                    </span>

                    <span
                        className="
                        font-bold
                        "
                    >
                        {
                            dashboard
                            .nutrition
                            .goal_calories
                        } kcal
                    </span>

                </div>

                <div
                    className="
                    bg-red-50
                    text-red-500
                    rounded-xl
                    p-3
                    text-center
                    font-semibold
                    "
                >

                    {
                        Math.round(
                            health.tdee
                            -
                            dashboard
                            .nutrition
                            .goal_calories
                        )
                    }

                    {" "}
                    kcal deficit

                </div>

            </div>
            
            <button
                onClick={() =>
                    navigate(
                        "/profile-setup"
                    )
                }
                className="
                w-full
                mt-4
                bg-green-500
                hover:bg-green-600
                text-white
                py-3
                rounded-xl
                font-semibold
                "
            >
                Edit Profile
            </button>


        </div>

    );
}