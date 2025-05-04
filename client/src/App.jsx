import { useAuth } from "@clerk/clerk-react";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "./components/main/Loader";
import Navbar from "./components/main/Navbar";
import Homepage from "./pages/Homepage";
import ErrorPage from "./pages/ErrorPage";
import Dashboard from "./pages/Dashboard";
import ChatMockInterview from "./pages/MockInterview/ChatMockInterview";
import GetAllQuestionInfo from "./pages/MockInterview/GetAllQuestionInfo";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const App = () => {
    const { isLoaded } = useAuth();

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
                            <Dashboard />
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
