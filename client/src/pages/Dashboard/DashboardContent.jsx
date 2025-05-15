import { ChevronDown, Info } from "lucide-react";
import React from "react";

const DashboardContent = () => {
    return (
        <h1>
            <div className="flex items-center gap-2 mb-4">
                <Info className="h-5 w-5 text-light-primary dark:text-dark-primary" />
                <span className="text-lg font-semibold">Dashboard</span>
            </div>
            <p className="text-sm text-light-secondary dark:text-dark-secondary">
                Welcome to your dashboard! Here you can find all the information you need.
            </p>
            <div className="flex items-center gap-2 mt-4 cursor-pointer">
                <span className="text-sm text-light-secondary dark:text-dark-secondary">More Info</span>
                <ChevronDown className="h-4 w-4 text-light-secondary dark:text-dark-secondary" />
            </div>
        </h1>
    );
};

export default DashboardContent;
