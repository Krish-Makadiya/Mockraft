import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/main/Sidebar";
import LeaderboardContent from "./LeaderboardContent";

const Leaderboard = ({tabs}) => {
    const location = useLocation();

    const getActiveTab = () => {
        return (
            tabs.find((tab) => tab.path === location.pathname)?.name ||
            tabs[0].name
        );
    };

    return (
        <div className="flex relative">
            <Sidebar tabs={tabs} getActiveTab={getActiveTab} />

            <div className="h-full w-full bg-light-bg dark:bg-dark-surface py-10 px-8">
                <LeaderboardContent />
            </div>
        </div>
    );
};

export default Leaderboard;
