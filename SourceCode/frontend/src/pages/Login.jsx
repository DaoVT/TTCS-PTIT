import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

export default function Login() {

    const navigate =
        useNavigate();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const login = async (
        e
    ) => {

        e.preventDefault();

        try {

            const response =
                await api.post(
                    "/auth/login",
                    {
                        email,
                        password
                    }
                );

            localStorage.setItem(
                "token",
                response.data.access_token
            );

            navigate(
                "/dashboard"
            );

        } catch {

            setError(
                "Email hoặc mật khẩu không đúng"
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
                max-w-md
                "
            >

                <div className="text-center mb-8">

                    <h1
                        className="
                        text-4xl
                        font-bold
                        text-green-600
                        "
                    >
                        NutriCoach
                    </h1>

                    <p
                        className="
                        text-gray-500
                        mt-2
                        "
                    >
                        Welcome Back 👋
                    </p>

                </div>

                {error && (

                    <div
                        className="
                        bg-red-100
                        text-red-500
                        rounded-xl
                        p-3
                        mb-4
                        "
                    >
                        {error}
                    </div>

                )}

                <form
                    onSubmit={login}
                    className="space-y-5"
                >

                    <div>

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
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
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
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

                    <button
                        type="submit"
                        className="
                        w-full
                        bg-green-500
                        hover:bg-green-600
                        text-white
                        py-3
                        rounded-xl
                        font-semibold
                        "
                    >
                        Login
                    </button>

                </form>

                <div
                    className="
                    text-center
                    mt-6
                    "
                >

                    Chưa có tài khoản?

                    <Link
                        to="/register"
                        className="
                        text-green-600
                        font-semibold
                        ml-2
                        "
                    >
                        Register
                    </Link>

                </div>

            </div>

        </div>

    );
}