import { useNavigate } from "react-router-dom";

export default function Header({
    dashboard
}) {
    const navigate =
        useNavigate();

    const logout = () => {

        localStorage.removeItem(
            "token"
        );

        navigate(
            "/login"
        );
    };

    const today =
        new Date();

    return (

        <div
            className="
            bg-white
            rounded-2xl
            shadow
            px-6
            py-4
            flex
            justify-between
            items-center
            "
        >

            <div>

                <h1
                    className="
                    text-2xl
                    font-bold
                    "
                >
                    Xin chào 👋
                </h1>

                <p
                    className="
                    text-gray-500
                    text-sm
                    "
                >
                    {
                        today.toLocaleDateString(
                            "vi-VN",
                            {
                                weekday:
                                    "long",
                                day:
                                    "numeric",
                                month:
                                    "long",
                                year:
                                    "numeric"
                            }
                        )
                    }
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
                    text-right
                    "
                >

                    <p
                        className="
                        font-semibold
                        "
                    >
                        {
                            dashboard
                            .user
                            .email
                        }
                    </p>

                    <p
                        className="
                        text-xs
                        text-gray-500
                        "
                    >
                        NutriCoach User
                    </p>

                </div>

                <button
                    onClick={logout}
                    className="
                    bg-red-500
                    hover:bg-red-600
                    text-white
                    px-4
                    py-2
                    rounded-xl
                    "
                >
                    Logout
                </button>

            </div>

        </div>

    );
}