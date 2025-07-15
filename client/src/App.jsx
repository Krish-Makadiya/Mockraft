import { useAuth, useUser } from "@clerk/clerk-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
    LayoutDashboard,
    UserRoundSearch,
    ChartColumnIncreasing,
    FileText,
    BrainCircuit,
    Puzzle,
    Calculator,
    Book,
    Sigma,
    Brain,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Loader from "./components/main/Loader";
import Navbar from "./components/main/Navbar";
import { db } from "./config/firebase"; // adjust the import
import Dashboard from "./pages/Dashboard/Dashboard";
import ErrorPage from "./pages/ErrorPage";
import Homepage from "./pages/Home/Homepage";
import ChatMockInterview from "./pages/MockInterview/ChatMockInterview";
import GetAllQuestionInfo from "./pages/MockInterview/GetAllQuestionInfo";
import MockInterview from "./pages/MockInterview/MockInterview";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import AboutUsPage from "./pages/Home/AboutUsPage";
import Pricing from "./components/Homepage/Pricing";
import PricingPage from "./pages/Home/PricingPage";
import ContactUsPage from "./pages/Home/ContactUsPage";
import AptitudeAllQuestions from "./pages/Aptitude/AptitudeAllQuestions";
import Aptitude from "./pages/AptitudeTest/Aptitude";
import AptitudeTest from "./pages/AptitudeTest/AptitudeTest";
import AptitudeTestAnalysis from "./pages/AptitudeTest/AptitudeTestAnalysis"

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
        icon: FileText,
        path: "/mock-interview",
    },
    {
        id: 3,
        name: "Aptitude",
        icon: Brain,
        path: "/aptitude",
    },
    {
        id: 4,
        name: "Question Bank",
        icon: Book,
        path: "/aptitude/all-questions",
    },
    {
        id: 5,
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
                    createdAt: user.createdAt,
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
        <div className=" select-none font-[poppins] bg-light-bg dark:bg-dark-bg text-light-primary-text dark:text-dark-primary-text">
            <Routes>
                <Route
                    path="/"
                    element={
                        <div>
                            <Homepage />
                        </div>
                    }
                />
                <Route path="/about-us" element={<AboutUsPage />}></Route>
                <Route path="/pricing" element={<PricingPage />}></Route>
                <Route path="/contact-us" element={<ContactUsPage />}></Route>
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
                    path="/aptitude/all-questions"
                    element={
                        <ProtectedRoute>
                            <AptitudeAllQuestions
                                tabs={tabs}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/aptitude"
                    element={
                        <ProtectedRoute>
                            <Aptitude
                                tabs={tabs}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/:user_id/aptitude/:testId"
                    element={
                        <ProtectedRoute>
                            <AptitudeTest />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/:user_id/aptitude/:testId/analysis"
                    element={
                        <ProtectedRoute>
                            <AptitudeTestAnalysis />
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
