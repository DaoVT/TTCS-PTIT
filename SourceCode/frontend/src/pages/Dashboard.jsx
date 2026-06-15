import { useEffect, useState } from "react";

import api from "../services/api";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DashboardStats from "../components/DashboardStats";
import MealsSection from "../components/MealsSection";
import AICoach from "../components/AICoach";

export default function Dashboard() {
    const [dashboard, setDashboard] =
        useState(null);
    
    useEffect(() => {

        loadDashboard();

}, []);

    const loadDashboard = async () => {

        try {

            const token =
                localStorage.getItem(
                    "token"
                );

            const response =
                await api.get(
                    "/dashboard",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            setDashboard(
                response.data
            );

        } catch (error) {

            console.log(error);

        }
    };

    if (!dashboard) {

        return <h2>Loading...</h2>;
    }
    console.log(dashboard);
    return (

        <div
            className="
            min-h-screen
            bg-gray-100
            p-6
            "
        >

            <div
                className="
                space-y-6
                "
            >
                <Header
                    dashboard={dashboard}
                />  
                <div
                    className="
                    grid
                    grid-cols-12
                    gap-6
                    "
                >   
                <div className="col-span-3">

                    <Sidebar 
                        dashboard={dashboard}
                    />

                </div>

                <div className="col-span-6 space-y-6">

                    <DashboardStats 
                        dashboard={dashboard}
                    />

                    <MealsSection 
                        refreshDashboard={
                            loadDashboard
                        }
                    />

                </div>

                <div className="col-span-3">

                    <AICoach />

                </div>

            </div>
        </div>
        </div>
    );
}