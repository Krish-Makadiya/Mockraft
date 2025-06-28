// Place this in a suitable file, e.g., components/RankProgressBar.jsx

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

export const RANKS = [
    {
        level: 1,
        name: "Beginner",
        minPoints: 0,
        maxPoints: 99,
        icon: "Sprout", // new user, just started
    },
    {
        level: 2,
        name: "Learner",
        minPoints: 100,
        maxPoints: 249,
        icon: "NotebookPen", // actively studying
    },
    {
        level: 3,
        name: "Skilled",
        minPoints: 250,
        maxPoints: 499,
        icon: "Pickaxe", // building skills
    },
    {
        level: 4,
        name: "Proficient",
        minPoints: 500,
        maxPoints: 799,
        icon: "LayoutTemplate", // structured, methodical
    },
    {
        level: 5,
        name: "Expert",
        minPoints: 800,
        maxPoints: 1199,
        icon: "Atom", // deep understanding
    },
    {
        level: 6,
        name: "Champion",
        minPoints: 1200,
        maxPoints: 1599,
        icon: "Medal", // winning, top performer
    },
    {
        level: 7,
        name: "Master",
        minPoints: 1600,
        maxPoints: 1999,
        icon: "ShieldCheck", // strong, reliable
    },
    {
        level: 8,
        name: "Legend",
        minPoints: 2000,
        maxPoints: Infinity,
        icon: "Trophy", // ultimate achievement
    },
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

const MOTIVATION_LINES = [
    "“Ego kills growth. Stay humble, keep leveling up.”",
    "“Your comfort zone is your enemy. Break it, or stay average.”",
    "“If you’re not willing to be a beginner, you’ll never become a master.”",
    "“Excuses don’t earn points. Actions do.”",
    "“Dreams don’t work unless you do. Prove yourself.”",
    "“You can have results or excuses. Not both.”",
    "“The grind doesn’t care about your feelings.”",
    "“You’re only as good as your last effort. Keep pushing.”",
    "“Growth begins where ego ends.”",
    "“Don’t let pride make you average.”",
];

export function RankProgressBar({ points }) {
    // Find current rank
    const currentRank =
        RANKS.find(
            (rank) => points >= rank.minPoints && points <= rank.maxPoints
        ) || RANKS[0];
    // Find next rank (unless at max)
    const nextRank =
        RANKS.find((rank) => rank.level === currentRank.level + 1) || null;

    // Progress toward next rank
    const min = currentRank.minPoints;
    const max =
        currentRank.maxPoints === Infinity ? points : currentRank.maxPoints;
    const progress =
        currentRank.maxPoints === Infinity
            ? 100
            : Math.min(100, ((points - min) / (max - min)) * 100);

    const Icon = ICONS[currentRank.icon];

    // Pick a random motivational line on each render
    const randomLine = React.useMemo(
        () =>
            MOTIVATION_LINES[
                Math.floor(Math.random() * MOTIVATION_LINES.length)
            ],
        []
    );

    return (
        <div className="w-full mx-auto p-6 bg-gradient-to-br from-yellow-50 via-white to-yellow-100 dark:from-gray-900 dark:via-yellow-900/30 dark:to-gray-800 rounded-2xl shadow-xl border border-yellow-200 dark:border-yellow-900">
            <div className="flex items-center justify-between mb-4">
                {/* Current Rank */}
                <div className="flex items-center gap-2">
                    <Icon className="w-9 h-9 text-yellow-500 drop-shadow" />
                    <span className="font-bold text-2xl tracking-wide text-yellow-700 dark:text-yellow-200">
                        {currentRank.name}
                    </span>
                    <span className="ml-2 px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-200 text-xs font-semibold border border-yellow-200 dark:border-yellow-800">
                        Current Rank
                    </span>
                </div>
                <span className="text-base font-semibold text-gray-700 dark:text-gray-200">
                    {points} pts
                </span>
            </div>

            {/* Next Rank */}
            {nextRank && (
                <div className="flex items-center justify-between gap-2 mb-2">
                    {ICONS[nextRank.icon] && (
                        <span className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Next:
                            </span>
                            {React.createElement(ICONS[nextRank.icon], {
                                className: "w-8 h-8 text-purple-500",
                            })}
                            <span className="font-semibold text-lg text-purple-700 dark:text-purple-200">
                                {nextRank.name}
                            </span>
                            <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                                ({nextRank.minPoints} pts)
                            </span>
                        </span>
                    )}
                    <span className="ml-2 px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-200 text-xs font-semibold border border-purple-200 dark:border-purple-800">
                        {nextRank.minPoints - points} pts to upgrade
                    </span>
                </div>
            )}

            <div className="relative w-full h-5 bg-gray-200 dark:bg-gray-900 rounded-full overflow-hidden shadow-inner mb-2 mt-2">
                <div
                    className="h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 transition-all duration-500 animate-pulse"
                    style={{ width: `${progress}%` }}
                />
                {/* Animated stripes overlay for progress */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "repeating-linear-gradient(135deg,rgba(255,255,255,0.10) 0 8px,transparent 8px 16px)",
                        width: `${progress}%`,
                    }}
                />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                <span>{currentRank.minPoints} pts</span>
                <span>
                    {nextRank
                        ? `${nextRank.name} at ${nextRank.minPoints} pts`
                        : "Max Rank"}
                </span>
            </div>
            <div className="mt-4 text-center text-sm text-yellow-700 dark:text-yellow-200 font-medium">
                {randomLine}
            </div>
        </div>
    );
}
