import React from "react";
import {
    Sprout,
    NotebookPen,
    Pickaxe,
    LayoutTemplate,
    Atom,
    Medal,
    ShieldCheck,
    Trophy,
} from "lucide-react";

// Static rank data and icons
const RANKS = [
    { level: 1, name: "Seedling", icon: "Sprout", minPoints: 0, maxPoints: 99 },
    { level: 2, name: "Writer", icon: "NotebookPen", minPoints: 100, maxPoints: 299 },
    { level: 3, name: "Miner", icon: "Pickaxe", minPoints: 300, maxPoints: 599 },
    { level: 4, name: "Designer", icon: "LayoutTemplate", minPoints: 600, maxPoints: 999 },
    { level: 5, name: "Scientist", icon: "Atom", minPoints: 1000, maxPoints: 1499 },
    { level: 6, name: "Champion", icon: "Medal", minPoints: 1500, maxPoints: 1999 },
    { level: 7, name: "Guardian", icon: "ShieldCheck", minPoints: 2000, maxPoints: 2999 },
    { level: 8, name: "Legend", icon: "Trophy", minPoints: 3000, maxPoints: Infinity },
];

const ICONS = {
    Sprout,
    NotebookPen,
    Pickaxe,
    LayoutTemplate,
    Atom,
    Medal,
    ShieldCheck,
    Trophy,
};

export default function RankLevelSection({ userPoints }) {
    // Find current rank index
    const currentRankIndex = RANKS.findIndex(
        (rank) => userPoints >= rank.minPoints && userPoints <= rank.maxPoints
    );

    return (
        <div className="w-full flex flex-col items-center md:gap-6 gap-4 bg-light-surface dark:bg-dark-bg p-6 rounded-xl shadow-md transition-transform duration-300 hover:scale-[1.005] hover:shadow-lg">
            <div className="flex items-center md:w-[90%] w-full">
                {RANKS.map((rank, idx) => {
                    const isCurrent = idx === currentRankIndex;
                    const isCompleted = idx < currentRankIndex;
                    const Icon = ICONS[rank.icon];
                    return (
                        <React.Fragment key={rank.level}>
                            <div className="flex flex-col items-center">
                                <div
                                    className={`rounded-full border-2 md:p-4 p-2 mb-1
                                        ${
                                            isCurrent
                                                ? "border-yellow-500 bg-yellow-100 dark:bg-yellow-900/40"
                                                : isCompleted
                                                ? "border-green-400 bg-green-100 dark:bg-green-900/40"
                                                : "border-gray-300 bg-gray-100 dark:bg-gray-800"
                                        }
                                    `}
                                >
                                    <Icon
                                        className={`md:w-10 md:h-10 w-6 h-6
                                            ${
                                                isCurrent
                                                    ? "text-yellow-600"
                                                    : isCompleted
                                                    ? "text-green-500"
                                                    : "text-gray-400 dark:text-gray-500"
                                            }
                                        `}
                                    />
                                </div>
                                <span
                                    className={`md:text-sm text-[8px] font-semibold
                                        ${
                                            isCurrent
                                                ? "text-yellow-700 dark:text-yellow-200"
                                                : isCompleted
                                                ? "text-green-600 dark:text-green-300"
                                                : "text-gray-400 dark:text-gray-500"
                                        }
                                    `}
                                >
                                    {rank.name}
                                </span>
                            </div>
                            {idx < RANKS.length - 1 && (
                                <div
                                    className={`flex-1 h-1 md:mx-1 mx-0 rounded-full
                                        ${
                                            idx < currentRankIndex
                                                ? "bg-green-400"
                                                : idx === currentRankIndex
                                                ? "bg-yellow-400"
                                                : "bg-gray-300 dark:bg-gray-700"
                                        }
                                    `}
                                    style={{
                                        minWidth: 8,
                                        maxWidth: 100,
                                    }}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
            <div className="text-gray-500 dark:text-gray-400">
                You are currently at{" "}
                <span className="font-bold text-yellow-600 dark:text-yellow-300">
                    {RANKS[currentRankIndex]?.name}
                </span>{" "}
                rank with{" "}
                <span className="font-bold">{userPoints}</span> points.
            </div>
        </div>
    );
}