import {
    FaBell,
    FaCog,
    FaUserCircle
}
from "react-icons/fa";

export default function Navbar() {

    return (

        <div
            className="
            bg-white
            border-b
            px-6
            py-4
            flex
            justify-between
            items-center
            "
        >

            <h1
                className="
                text-2xl
                font-bold
                text-green-500
                "
            >
                NutriCoach AI
            </h1>

            <div
                className="
                flex
                items-center
                gap-6
                "
            >

                <FaBell />

                <FaCog />

                <FaUserCircle
                    size={28}
                />

            </div>

        </div>

    );
}