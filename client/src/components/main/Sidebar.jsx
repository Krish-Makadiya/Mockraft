import { UserButton, useUser } from "@clerk/clerk-react";
import { PanelLeftClose, PanelLeftOpen, ChartColumnIncreasing  } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeProvider";

const Sidebar = ({ tabs }) => {
    const { user } = useUser();
    // Initialize isCollapsed from localStorage or default to false
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem("sidebarCollapsed");
        return saved ? JSON.parse(saved) : false;
    });
    const navigate = useNavigate();
    const location = useLocation();

    // Update localStorage whenever isCollapsed changes
    const handleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
    };

    const getActiveTab = () => {
        return (
            tabs.find((tab) => tab.path === location.pathname)?.name ||
            tabs[0].name
        );
    };

    return (
        <>
            <button
                onClick={handleCollapse}
                className="rounded-lg absolute hover:bg-light-hover dark:hover:bg-dark-hover px-4 py-6 md:opacity-0 opacity-100 md:hidden transition-all duration-300 ease-in-out">
                {isCollapsed ? (
                    <PanelLeftOpen size={25} />
                ) : (
                    <PanelLeftClose size={25} />
                )}
            </button>
            <aside
                className={`sticky  top-0 h-screen ${
                    isCollapsed ? "md:w-20 md:block hidden" : "md:w-60 w-[300px]"
                } bg-light-surface dark:bg-dark-bg text-light-primary-text dark:text-dark-primary-text flex flex-col px-3 py-5 transition-all duration-300 ease-in-out`}>
                <div
                    className={`flex px-4 ${
                        isCollapsed ? "justify-center" : "justify-between"
                    } items-center w-full`}>
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                        }`}>
                        <p
                            className="text-2xl font-semibold cursor-pointer whitespace-nowrap"
                            onClick={() => navigate("/")}>
                            Mockie
                        </p>
                    </div>
                    <button
                        onClick={handleCollapse}
                        className="rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover p-2 md:opacity-100">
                        {isCollapsed ? (
                            <PanelLeftOpen size={22} />
                        ) : (
                            <PanelLeftClose size={22} />
                        )}
                    </button>
                </div>

                <hr className="mt-3 mb-4 border-light-border dark:border-dark-border opacity-20" />
                <nav className="flex-1">
                    <ul className="space-y-2">
                        {tabs.map((tab) => (
                            <li
                                key={tab.id}
                                className={`cursor-pointer px-4 py-2 text-base rounded-lg transition-all duration-300 ease-in-out ${
                                    getActiveTab() === tab.name
                                        ? "bg-light-primary/10 dark:bg-dark-primary/10 text-light-primary dark:text-dark-primary"
                                        : "hover:bg-light-hover dark:hover:bg-dark-hover"
                                }`}
                                onClick={() => navigate(tab.path)}>
                                <div className="flex items-center">
                                    <tab.icon className="shrink-0" size={20} />
                                    <span
                                        className={`ml-2 transition-all duration-300 ease-in-out ${
                                            isCollapsed
                                                ? "w-0 opacity-0"
                                                : "w-auto opacity-100"
                                        } whitespace-nowrap overflow-hidden`}>
                                        {tab.name}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div
                    className={`flex items-center justify-center mt-8 transition-all duration-300 ease-in-out`}>
                    {!isCollapsed ? (
                        <div className="flex items-center justify-center gap-2 overflow-hidden">
                            <UserButton />
                            <p className="font-medium whitespace-nowrap transition-all duration-300 ease-in-out">
                                {user.fullName ||
                                    user.firstName + user.lastName}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <UserButton />
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
