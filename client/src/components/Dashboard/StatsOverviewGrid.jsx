import React from "react";
import { MessagesSquare, TrendingUpIcon, TargetIcon, Trophy } from "lucide-react";


export default function StatsOverviewGrid({ total, last7Days, avgScore, points }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <div
                className="flex justify-between md:p-6 p-3 rounded-2xl shadow-md items-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-blue-100 dark:border-blue-900
                bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 dark:from-blue-900 dark:via-blue-800 dark:to-blue-700">
                <div className="flex flex-col gap-2">
                    <p className="md:text-lg text-sm text-blue-900 dark:text-blue-100 font-semibold">
                        Total Interviews
                    </p>
                    <p className="text-4xl font-bold text-blue-900 dark:text-blue-100">
                        {total}
                    </p>
                </div>
                <div className="flex items-center justify-center">
                    <div className="p-4 rounded-full bg-blue-300 dark:bg-blue-900 transition-all duration-200 hover:bg-blue-200 dark:hover:bg-blue-800">
                        <MessagesSquare className="text-blue-700 dark:text-blue-200 transition-all duration-200 md:h-10 md:w-10 h-6 w-6" />
                    </div>
                </div>
            </div>
            <div
                className="flex justify-between  md:p-6 p-3 rounded-2xl shadow-md items-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-green-100 dark:border-green-900
                bg-gradient-to-r from-green-300 via-green-400 to-green-500 dark:from-green-800 dark:via-green-700 dark:to-green-600">
                <div className="flex flex-col gap-2">
                    <p className="md:text-lg text-sm text-green-900 dark:text-green-100 font-semibold">
                        This Week
                    </p>
                    <p className="text-4xl font-bold text-green-900 dark:text-green-100">
                        {last7Days}
                    </p>
                </div>
                <div className="flex items-center justify-center">
                    <div className="p-4 rounded-full bg-white/40 dark:bg-green-900 transition-all duration-200 hover:bg-green-200 dark:hover:bg-green-800">
                        <TrendingUpIcon className="text-green-700 dark:text-green-200 transition-all duration-200  md:h-10 md:w-10 h-6 w-6" />
                    </div>
                </div>
            </div>
            <div
                className="flex justify-between  md:p-6 p-3 rounded-2xl shadow-md items-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-yellow-100 dark:border-yellow-900
                bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 dark:from-yellow-800 dark:via-yellow-700 dark:to-yellow-600">
                <div className="flex flex-col gap-2">
                    <p className="md:text-lg text-sm text-yellow-900 dark:text-yellow-100 font-semibold">
                        Average Score
                    </p>
                    <p className="text-4xl font-bold text-yellow-900 dark:text-yellow-100">
                        {avgScore}%
                    </p>
                </div>
                <div className="flex items-center justify-center">
                    <div className="p-4 rounded-full bg-white/40 dark:bg-yellow-900 transition-all duration-200 hover:bg-yellow-200 dark:hover:bg-yellow-800">
                        <TargetIcon className="text-yellow-700 dark:text-yellow-200 transition-all duration-200 md:h-10 md:w-10 h-6 w-6" />
                    </div>
                </div>
            </div>
            {/* Points Earned is static, just needs points prop */}
            <div
                className="flex justify-between  md:p-6 p-3 rounded-2xl shadow-md items-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-purple-100 dark:border-purple-900
                bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 dark:from-purple-900 dark:via-purple-800 dark:to-purple-700">
                <div className="flex flex-col gap-2">
                    <p className="md:text-lg text-sm text-purple-900 dark:text-purple-100 font-semibold">
                        Points Earned
                    </p>
                    <p className="text-4xl font-bold text-purple-900 dark:text-purple-100">
                        {points}
                    </p>
                </div>
                <div className="flex items-center justify-center">
                    <div className="p-4 rounded-full bg-white/40 dark:bg-purple-900 transition-all duration-200 hover:bg-purple-200 dark:hover:bg-purple-800">
                        <Trophy className="text-purple-700 dark:text-purple-200 transition-all duration-200 md:h-10 md:w-10 h-6 w-6" />
                    </div>
                </div>
            </div>
        </div>
    );
}