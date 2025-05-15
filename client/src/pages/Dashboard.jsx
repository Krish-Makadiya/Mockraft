import { UserButton, useUser } from "@clerk/clerk-react";
import { LayoutDashboard, Moon, Sun, UserRoundSearch } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeProvider";
import DashboardContent from "../pages/Dashboard/DashboardContent";
import MockInterviewContent from "./MockInterview/MockInterviewContent";

const tabs = [
    { id: 1, name: "Dashboard", icon: LayoutDashboard },
    { id: 2, name: "Mock Interview", icon: UserRoundSearch },
];

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState(tabs[0].name);
    const { theme, setTheme } = useTheme();

    const navigate = useNavigate();
    const { user } = useUser();

    const renderContent = () => {
        switch (activeTab) {
            case "Dashboard":
                return <DashboardContent />;
            case "Mock Interview":
                return <MockInterviewContent />;
            default:
                return null;
        }
    };

    return (
        <div className="flex relative">
            <aside className="sticky select-none top-0 h-screen w-64 bg-light-surface dark:bg-dark-bg text-light-primary-text dark:text-dark-primary-text flex flex-col px-3 py-5 overflow-y-auto">
                <div className="flex justify-center items-center mb-4">
                    <p
                        className="text-2xl font-semibold cursor-pointer"
                        onClick={() => navigate("/")}>
                        Connectly
                    </p>
                </div>

                <nav className="flex-1">
                    <ul className="space-y-2">
                        {tabs.map((tab) => (
                            <li
                                key={tab.id}
                                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                                    activeTab === tab.name
                                        ? "bg-light-primary dark:bg-dark-primary text-dark-primary-text"
                                        : "hover:bg-light-surface dark:hover:bg-dark-surface"
                                }`}
                                onClick={() => setActiveTab(tab.name)}>
                                <div className="flex items-center gap-3">
                                    <tab.icon className="h-5 w-5" />
                                    <span>{tab.name}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center justify-between mt-8">
                    <div className="flex items-center gap-2">
                        <UserButton />
                        <p className="font-medium">
                            {user.fullName || user.firstName + user.lastName}
                        </p>
                    </div>
                    {theme ? (
                        <Sun
                            onClick={() => setTheme(!theme)}
                            className="h-6 w-6 text-light-primary-text dark:text-dark-primary-text"
                        />
                    ) : (
                        <Moon
                            onClick={() => setTheme(!theme)}
                            className="h-6 w-6 text-light-primary-text dark:text-dark-primary-text"
                        />
                    )}
                </div>
            </aside>

            <div className="h-full w-full bg-light-bg dark:bg-dark-surface py-10 px-8">
                {renderContent()}
            </div>
        </div>
    );
}
