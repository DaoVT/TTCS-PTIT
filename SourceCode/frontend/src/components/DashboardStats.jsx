import { CircularProgressbar} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

export default function DashboardStats({
    dashboard
}) {
    console.log("Dashboard Data:", dashboard);

    const nutrition =
        dashboard.nutrition;

    const percentage =
        Math.round(
            (
                nutrition.consumed_calories
                /
                nutrition.goal_calories
            ) * 100
        );

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
                Calorie Tracker
            </h2>

            <div
                className="
                grid
                grid-cols-12
                gap-6
                items-center
                "
            >

                {/* Circle */}

                <div
                    className="
                    col-span-3
                    "
                >

                    <CircularProgressbar
                        value={
                            percentage
                        }
                        text={
                            `${percentage}%`
                        }
                    />

                    <p
                        className="
                        text-center
                        mt-4
                        text-sm
                        text-gray-500
                        "
                    >
                        {
                            nutrition
                            .remaining_calories
                        }

                        {" "}
                        kcal remaining
                    </p>

                </div>

                {/* Stats */}

                <div
                    className="
                    col-span-9
                    "
                >

                    <div
                        className="
                        grid
                        grid-cols-3
                        gap-4
                        mb-8
                        "
                    >

                        <div
                            className="
                            bg-gray-100
                            rounded-xl
                            p-4
                            text-center
                            "
                        >

                            <p
                                className="
                                text-3xl
                                font-bold
                                "
                            >
                                {
                                    nutrition
                                    .goal_calories
                                }
                            </p>

                            <p>
                                Target
                            </p>

                        </div>

                        <div
                            className="
                            bg-gray-100
                            rounded-xl
                            p-4
                            text-center
                            "
                        >

                            <p
                                className="
                                text-3xl
                                font-bold
                                text-green-500
                                "
                            >
                                {
                                    nutrition
                                    .consumed_calories
                                }
                            </p>

                            <p>
                                Eaten
                            </p>

                        </div>

                        <div
                            className="
                            bg-gray-100
                            rounded-xl
                            p-4
                            text-center
                            "
                        >

                            <p
                                className="
                                text-3xl
                                font-bold
                                text-blue-500
                                "
                            >
                                {
                                    nutrition
                                    .remaining_calories
                                }
                            </p>

                            <p>
                                Remaining
                            </p>

                        </div>

                    </div>

                    {/* Macros */}

                    <h3
                        className="
                        font-semibold
                        mb-3
                        "
                    >
                        Macros
                    </h3>

                    <div
                        className="
                        flex
                        h-4
                        rounded-full
                        overflow-hidden
                        "
                    >

                        <div
                            className="
                            bg-green-500
                            "
                            style={{
                                width: `${nutrition.protein_percent}%`
                            }}
                        
                        />      

                        <div
                            className="
                            bg-blue-500
                            "
                            style={{
                                width:
                                `${nutrition.carbs_percent}%`
                            }}
                        />

                        <div
                            className="
                            bg-yellow-400
                            "
                            style={{
                                width:
                                `${nutrition.fat_percent}%`
                            }}
                        />

                    </div>
                        <div
                            className="
                            flex
                            justify-between
                            mt-2
                            text-sm
                            "
                        >

                            <span>
                                Protein {nutrition.protein}g
                            </span>

                            <span>
                                Carbs {nutrition.carbs}g
                            </span>

                            <span>
                                Fat {nutrition.fat}g
                            </span>

                        </div>

                                        </div>

                                    </div>

                                </div>

                            );
                        }