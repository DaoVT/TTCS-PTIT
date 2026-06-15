import { useEffect, useState } from "react";
import api from "../services/api";

export default function PredictWeight() {

    const [predictions, setPredictions] =
        useState([]);

    useEffect(() => {

        loadPrediction();

    }, []);

    const loadPrediction =
        async () => {

            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );

                const response =
                    await api.get(
                        "/prediction/weight",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                setPredictions(
                    response.data
                );

            } catch (error) {

                console.log(error);

            }
        };

    return (

        <div
            className="
            p-8
            min-h-screen
            bg-gray-100
            "
        >

            <h1
                className="
                text-3xl
                font-bold
                mb-6
                "
            >
                Weight Prediction
            </h1>

            <div
                className="
                bg-white
                rounded-2xl
                shadow
                p-6
                "
            >

                <h2
                    className="
                    text-xl
                    font-semibold
                    mb-4
                    "
                >
                    Predicted Weight
                </h2>

                {
                    predictions.length > 0
                    ? (

                        <div>

                            <p
                                className="
                                mb-4
                                text-gray-600
                                "
                            >
                                Estimated weight
                                for next 12 weeks
                            </p>

                            <ul
                                className="
                                space-y-2
                                "
                            >

                                {
                                    predictions.map(
                                        (item) => (

                                            <li
                                                key={
                                                    item.week
                                                }
                                                className="
                                                flex
                                                justify-between
                                                border-b
                                                pb-2
                                                "
                                            >

                                                <span>
                                                    {
                                                        item.week
                                                    }
                                                </span>

                                                <span
                                                    className="
                                                    font-semibold
                                                    "
                                                >
                                                    {
                                                        item.weight
                                                    } kg
                                                </span>

                                            </li>

                                        )
                                    )
                                }

                            </ul>

                        </div>

                    )
                    : (

                        <p>
                            Loading...
                        </p>

                    )
                }

            </div>

        </div>

    );
}