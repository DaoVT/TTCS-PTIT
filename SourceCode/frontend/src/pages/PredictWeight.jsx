import {
useEffect,
useState
} from "react";

import {
useNavigate
}
from "react-router-dom";

import api from "../services/api";

import {
ResponsiveContainer,
LineChart,
Line,
XAxis,
YAxis,
CartesianGrid,
Tooltip
}
from "recharts";

export default function PredictWeight() {

const navigate =
    useNavigate();

const [weeks, setWeeks] =
    useState(12);

const [data, setData] =
    useState([]);

useEffect(() => {

    loadPrediction();

}, [weeks]);

const loadPrediction =
    async () => {

        try {

            const response =
                await api.get(
                    `/prediction/weight?weeks=${weeks}`
                );

            setData(
                response.data
            );

        } catch (error) {

            console.log(error);

        }
    };

const currentWeight =
    data.length > 0
        ? data[0].weight
        : 0;

const predictedWeight =
    data.length > 0
        ? data[
            data.length - 1
        ].weight
        : 0;

const change =
    (
        predictedWeight
        -
        currentWeight
    ).toFixed(1);

let recommendation = "";

if (change < -3) {

    recommendation =
        "Excellent progress. Keep following your calorie deficit plan.";

}
else if (change < 0) {

    recommendation =
        "You are losing weight gradually. Stay consistent.";

}
else {

    recommendation =
        "Consider reducing calorie intake or increasing activity level.";

}

return (

    <div
        className="
        min-h-screen
        bg-gray-100
        p-8
        "
    >

        <button
            onClick={() =>
                navigate(
                    "/dashboard"
                )
            }
            className="
            mb-6
            text-blue-500
            font-semibold
            hover:text-blue-700
            "
        >
            ← Back Dashboard
        </button>

        <h1
            className="
            text-4xl
            font-bold
            mb-6
            "
        >
            Weight Prediction
        </h1>

        <div
            className="
            flex
            justify-between
            items-center
            mb-6
            "
        >

            <select
                value={weeks}
                onChange={(e) =>
                    setWeeks(
                        Number(
                            e.target.value
                        )
                    )
                }
                className="
                border
                rounded-xl
                px-4
                py-2
                bg-white
                shadow-sm
                "
            >

                <option value={4}>
                    4 Weeks
                </option>

                <option value={8}>
                    8 Weeks
                </option>

                <option value={12}>
                    12 Weeks
                </option>

                <option value={24}>
                    24 Weeks
                </option>

            </select>

            <div
                className="
                text-gray-500
                "
            >
                Forecast Period
            </div>

        </div>

        <div
            className="
            grid
            md:grid-cols-3
            gap-4
            mb-6
            "
        >

            <div
                className="
                bg-green-50
                border
                border-green-200
                rounded-2xl
                p-5
                shadow-sm
                "
            >

                <p
                    className="
                    text-gray-500
                    "
                >
                    Current Weight
                </p>

                <p
                    className="
                    text-4xl
                    font-bold
                    mt-2
                    "
                >
                    {currentWeight} kg
                </p>

            </div>

            <div
                className="
                bg-blue-50
                border
                border-blue-200
                rounded-2xl
                p-5
                shadow-sm
                "
            >

                <p
                    className="
                    text-gray-500
                    "
                >
                    Predicted Weight
                </p>

                <p
                    className="
                    text-4xl
                    font-bold
                    text-blue-600
                    mt-2
                    "
                >
                    {predictedWeight} kg
                </p>

            </div>

            <div
                className="
                bg-red-50
                border
                border-red-200
                rounded-2xl
                p-5
                shadow-sm
                "
            >

                <p
                    className="
                    text-gray-500
                    "
                >
                    Weight Change
                </p>

                <p
                    className="
                    text-4xl
                    font-bold
                    mt-2
                    "
                >
                    {change} kg
                </p>

            </div>

        </div>

        <div
            className="
            bg-white
            rounded-3xl
            shadow
            p-6
            "
        >

            <div
                className="
                flex
                justify-between
                items-center
                mb-4
                "
            >

                <h2
                    className="
                    text-xl
                    font-bold
                    "
                >
                    Weight Forecast
                </h2>

                <span
                    className="
                    text-gray-500
                    "
                >
                    Next {weeks} Weeks
                </span>

            </div>

            <ResponsiveContainer
                width="100%"
                height={500}
            >

                <LineChart
                    data={data}
                >

                    <CartesianGrid
                        strokeDasharray="3 3"
                    />

                    <XAxis
                        dataKey="week"
                    />

                    <YAxis />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="weight"
                        strokeWidth={4}
                        dot={{
                            r: 5
                        }}
                    />

                </LineChart>

            </ResponsiveContainer>

            <div
                className="
                mt-6
                bg-green-50
                rounded-2xl
                p-4
                "
            >

                <h3
                    className="
                    font-bold
                    mb-2
                    "
                >
                    AI Recommendation
                </h3>

                <p>
                    {recommendation}
                </p>

            </div>

            <div
                className="
                mt-4
                bg-yellow-50
                border
                border-yellow-200
                rounded-2xl
                p-4
                "
            >

                ⚠️ Prediction is based
                on your current profile
                and calorie target.

                <br />

                More historical weight
                records will improve
                prediction accuracy.

            </div>

        </div>

    </div>
);

}
