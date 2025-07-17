import React from "react";
import { ChartBar, Gauge } from "lucide-react";

/**
 * PerformanceAnalysisSection
 * - The heading, icon, and description are static.
 * - The stats.typeStats and QUESTION_TYPES are passed as props.
 */
const QUESTION_TYPES = [
    "technical",
    "behavioral",
    "system_design",
    "curveball",
];

export default function PerformanceAnalysisSection({ typeStats, questionTypes = QUESTION_TYPES }) {
    return (
        <div className="md:w-[49%] w-full bg-light-surface dark:bg-dark-bg rounded-xl md:p-6 p-4 flex flex-col shadow-md transition-transform duration-300 hover:scale-[1.005] hover:shadow-lg">
            <div className="flex items-center gap-4">
                <div className="bg-light-bg dark:bg-dark-surface p-3 rounded-full shadow-sm">
                    <ChartBar size={24} />
                </div>
                <div className="flex flex-col">
                    <p className="text-xl font-semibold">
                        Performance Analysis
                    </p>
                    <p className="text-light-secondary-text">
                        Breakdown by question categories
                    </p>
                </div>
            </div>
            <div>
                {typeStats && Object.keys(typeStats).length > 0 ? (
                    <ul className="mt-4 space-y-4">
                        {questionTypes.map((type) => {
                            const typeStat = typeStats[type] || {};
                            const avg = typeStat.avgScore || 0;
                            return (
                                <li
                                    key={type}
                                    className="flex items-center justify-between p-4 bg-light-bg dark:bg-dark-surface rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <Gauge size={24} />
                                        <div>
                                            <p className="font-semibold capitalize">
                                                {type.replace("_", " ")}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Total: {typeStat.total ?? 0}
                                                <br />
                                                Attempted: {typeStat.attempted ?? 0}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end min-w-[180px] w-1/3">
                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                                            Avg Score: {avg}%
                                        </span>
                                        <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className={`
                                                    h-full rounded-full transition-all duration-300
                                                    ${
                                                        avg >= 70
                                                            ? "bg-green-500"
                                                            : avg >= 40
                                                            ? "bg-yellow-400"
                                                            : "bg-red-400"
                                                    }
                                                `}
                                                style={{
                                                    width: `${avg}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 mt-4">
                        No performance data available.
                    </p>
                )}
            </div>
        </div>
    );
}