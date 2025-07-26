import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/main/Sidebar";
import CommunityContent from "../Community/CommunityContent";

const Community = ({ tabs }) => {
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

            <div className="h-screen w-full bg-light-bg dark:bg-dark-surface">
                <CommunityContent />
            </div>
        </div>
    );
};

export default Community;
