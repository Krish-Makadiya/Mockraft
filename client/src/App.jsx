import { useAuth, UserButton, useUser } from "@clerk/clerk-react";
import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Loader from "./components/main/Loader";
import Navbar from "./components/main/Navbar";
import Homepage from "./pages/Homepage";
import ErrorPage from "./pages/ErrorPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import ChatMockInterview from "./pages/MockInterview/ChatMockInterview";
import GetAllQuestionInfo from "./pages/MockInterview/GetAllQuestionInfo";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MockInterviewContent from "./pages/MockInterview/MockInterviewContent";
import { LayoutDashboard, Moon, Sun, UserRoundSearch } from "lucide-react";
import { useTheme } from "./context/ThemeProvider";
import DashboardContent from "./pages/Dashboard/DashboardContent";
import MockInterview from "./pages/MockInterview/MockInterview";

const tabs = [
    { 
        id: 1, 
        name: "Dashboard", 
        icon: LayoutDashboard,
        path: "/dashboard"
    },
    { 
        id: 2, 
        name: "Mock Interview", 
        icon: UserRoundSearch,
        path: "/mock-interview"
    },
];

const App = () => {
    const { isLoaded } = useAuth();
    const [activeTab, setActiveTab] = useState(tabs[0].name);
    const { theme, setTheme } = useTheme();

    const navigate = useNavigate();
    const { user } = useUser();

    if (!isLoaded) {
        return <Loader />;
    }

    return (
        <div className="h-screen font-[poppins] bg-light-bg dark:bg-dark-bg text-light-primary-text dark:text-dark-primary-text">
            <Routes>
                <Route
                    path="/"
                    element={
                        <div>
                            <Navbar />
                            <Homepage />
                        </div>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard
                                tabs={tabs}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/mock-interview"
                    element={
                        <ProtectedRoute>
                            <MockInterview
                                tabs={tabs}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/:user_id/mock-interview/:id"
                    element={
                        <ProtectedRoute>
                            <ChatMockInterview />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/:user_id/mock-interview/:id/analysis"
                    element={
                        <ProtectedRoute>
                            <GetAllQuestionInfo />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </div>
    );
};

export default App;
