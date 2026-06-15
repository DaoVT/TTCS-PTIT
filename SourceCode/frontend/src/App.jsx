import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProfileSetup from "./pages/ProfileSetup";
import ProtectedRoute from "./components/ProtectedRoute";
import PredictWeight from "./pages/PredictWeight";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />
                <Route
                    path="/profile-setup"
                    element={
                      <ProtectedRoute>
                          <ProfileSetup />
                      </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/predict-weight"
                    element={
                        <ProtectedRoute>
                            <PredictWeight />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/test"
                    element={<h1>TEST OK</h1>}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;