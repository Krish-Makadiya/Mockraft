import { useAuth, useUser } from "@clerk/clerk-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { LayoutDashboard, UserRoundSearch, ChartColumnIncreasing, FileText   } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Loader from "./components/main/Loader";
import Navbar from "./components/main/Navbar";
import { db } from "./config/firebase"; // adjust the import
import Dashboard from "./pages/Dashboard/Dashboard";
import ErrorPage from "./pages/ErrorPage";
import Homepage from "./pages/Homepage";
import ChatMockInterview from "./pages/MockInterview/ChatMockInterview";
import GetAllQuestionInfo from "./pages/MockInterview/GetAllQuestionInfo";
import MockInterview from "./pages/MockInterview/MockInterview";
import Leaderboard from "./pages/Leaderboard/Leaderboard";

const tabs = [
    {
        id: 1,
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
    },
    {
        id: 2,
        name: "Mock Interview",
        icon: FileText ,
        path: "/mock-interview",
    },
    {
        id: 3,
        name: "Leaderboard",
        icon: ChartColumnIncreasing,
        path: "/leaderboard",
    },
];

const useInitializeUser = () => {
    const { user } = useUser();

    useEffect(() => {
        const initializeUser = async () => {
            if (!user) return;
            const userRef = doc(db, "users", user.id);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    plan: "free",
                    points: 0,
                    email: user.emailAddresses[0]?.emailAddress || "",
                    firstname: user.firstName,
                    fullname: user.fullName,
                    lastname: user.lastName,
                    id: user.id,
                    avtaar: user.imageUrl,
                    createdAt: user.createdAt
                });
            }
        };

        initializeUser();
    }, [user]);
};

const App = () => {
    const { isLoaded } = useAuth();
    const [activeTab, setActiveTab] = useState(tabs[0].name);

    useInitializeUser();

    if (!isLoaded) {
        return <Loader />;
    }

    return (
        <div className="h-screen select-none font-[poppins] bg-light-bg dark:bg-dark-bg text-light-primary-text dark:text-dark-primary-text">
            <Routes>
                <Route
                    path="/"
                    element={
                        <div>
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
                <Route
                    path="/leaderboard"
                    element={
                        <ProtectedRoute>
                            <Leaderboard 
                                tabs={tabs}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </div>
    );
};

export default App;
