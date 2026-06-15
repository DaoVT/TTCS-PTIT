import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

export default function Register() {

    const navigate =
        useNavigate();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [
        confirmPassword,
        setConfirmPassword
    ] = useState("");

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const register = async (
        e
    ) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            password !==
            confirmPassword
        ) {

            setError(
                "Passwords do not match"
            );

            return;
        }

        try {

            await api.post(
                "/auth/register",
                {
                    email,
                    password
                }
            );

            setSuccess(
                "Registration successful!"
            );

            setTimeout(
                () => {

                    navigate(
                        "/login"
                    );

                },
                1500
            );

        } catch (error) {

            console.log(error);

            setError(
                "Registration failed"
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
                        NutriCoach AI
                    </h1>

                    <p
                        className="
                        text-gray-500
                        mt-2
                        "
                    >
                        Create your account 🚀
                    </p>

                </div>

                {error && (

                    <div
                        className="
                        bg-red-100
                        text-red-600
                        p-3
                        rounded-xl
                        mb-4
                        "
                    >
                        {error}
                    </div>

                )}

                {success && (

                    <div
                        className="
                        bg-green-100
                        text-green-600
                        p-3
                        rounded-xl
                        mb-4
                        "
                    >
                        {success}
                    </div>

                )}

                <form
                    onSubmit={
                        register
                    }
                    className="
                    space-y-5
                    "
                >

                    <div>

                        <label
                            className="
                            text-sm
                            font-medium
                            "
                        >
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
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-500
                            "
                            placeholder="example@gmail.com"
                            required
                        />

                    </div>

                    <div>

                        <label
                            className="
                            text-sm
                            font-medium
                            "
                        >
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
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-500
                            "
                            placeholder="********"
                            required
                        />

                    </div>

                    <div>

                        <label
                            className="
                            text-sm
                            font-medium
                            "
                        >
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            value={
                                confirmPassword
                            }
                            onChange={(e) =>
                                setConfirmPassword(
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
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-500
                            "
                            placeholder="********"
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
                        transition
                        "
                    >
                        Create Account
                    </button>

                </form>

                <div
                    className="
                    text-center
                    mt-6
                    text-gray-600
                    "
                >

                    Already have an account?

                    <Link
                        to="/login"
                        className="
                        text-green-600
                        font-semibold
                        ml-2
                        "
                    >
                        Login
                    </Link>

                </div>

            </div>

        </div>
    );
}

