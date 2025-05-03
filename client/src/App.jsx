import { useAuth } from "@clerk/clerk-react";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "./components/main/Loader";
import Navbar from "./components/main/Navbar";
import Homepage from "./pages/Homepage";
import ErrorPage from "./pages/ErrorPage";
import Dashboard from "./pages/Dashboard";
import ChatMockInterview from "./pages/MockInterview/ChatMockInterview";

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
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/mock-interview/:user_id/:id" element={<ChatMockInterview />} />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </div>
    );
};

export default App;
