import React, { useEffect, useState } from "react";
import { Crown, Medal, MedalIcon, Trophy, User } from "lucide-react";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuth, useUser } from "@clerk/clerk-react";
import Loader from "../../components/main/Loader";
import { motion } from "framer-motion";

const rankIcons = [
    <Crown className="md:w-8 w-6 md:h-8 h-6 text-yellow-400" />,
    <Trophy className="md:w-8 w-6 md:h-8 h-6 text-gray-400" />,
    <Medal className="md:w-8 w-6 md:h-8 h-6 text-orange-400" />,
];

// Custom gradient backgrounds and animation for top 3
const gradientClasses = [
    "relative bg-gradient-to-r from-yellow-200 via-yellow-100 to-transparent dark:from-yellow-800 dark:via-yellow-900 dark:to-transparent before:absolute before:inset-0 before:bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.03)_0_8px,transparent_8px_16px)] before:opacity-60 before:pointer-events-none before:rounded-xl",
    "relative bg-gradient-to-r from-gray-200 via-gray-100 to-transparent dark:from-gray-700 dark:via-gray-800 dark:to-transparent before:absolute before:inset-0 before:bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.03)_0_8px,transparent_8px_16px)] before:opacity-50 before:pointer-events-none before:rounded-xl",
    "relative bg-gradient-to-r from-orange-200 via-orange-100 to-transparent dark:from-orange-800/60 dark:via-orange-900/60 dark:to-transparent before:absolute before:inset-0 before:bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.03)_0_8px,transparent_8px_16px)] before:opacity-50 before:pointer-events-none before:rounded-xl",
];

const tableVariant = {
    hidden: {
        opacity: 0,
        y: -20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, staggerChildren: 0.2, when: "beforeChildren" },
    },
};

const childVariant = {
    hidden: {
        opacity: 0,
        x: -30,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.3 },
    },
};

const LeaderboardContent = () => {
    const [users, setUsers] = useState([]);
    const [currentUserRank, setCurrentUserRank] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const usersSnapshot = await getDocs(collection(db, "users"));
            const usersData = [];
            usersSnapshot.forEach((doc) => {
                usersData.push({ id: doc.id, ...doc.data() });
            });

            usersData.sort((a, b) => (b.points ?? 0) - (a.points ?? 0));

            setUsers(usersData);

            const idx = usersData.findIndex((u) => u.id == user.id);

            if (idx !== -1) {
                setCurrentUserRank({ ...usersData[idx], rank: idx + 1 });
            } else {
                setCurrentUserRank(null);
            }
            setLoading(false);
        };
        fetchUsers();
    }, [user]);

    const top10 = users.slice(0, 10);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="flex flex-col gap-10">
            {/* Header Card */}
            <motion.div
                initial={{
                    y: 20,
                    opacity: 0,
                }}
                animate={{
                    y: 0,
                    opacity: 1,
                }}
                transition={{
                    duration: 0.3,
                    type: "spring",
                    stiffness: 300,
                }}
                className="md:ml-0 ml-12">
                <h1 className="text-3xl font-bold">Leaderboard</h1>
                <p className="md:text-sm text-xs text-light-secondary-text dark:text-dark-secondary-text">
                    See how you stack up against others in the community!
                </p>
            </motion.div>

            {/* Tabs */}
            <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <motion.button className="px-4 py-1 rounded-full bg-blue-600 text-white font-semibold shadow transition">
                        All time
                    </motion.button>
                </div>

                {/* Current User Rank at Top */}
                {currentUserRank && (
                    <div className="">
                        <li
                            className={`relative grid md:grid-cols-6 grid-cols-5 items-center text-center py-4 mx-auto transition-all duration-300
                                bg-gradient-to-r from-blue-200 via-blue-100 to-transparent
                                dark:from-blue-800 dark:via-blue-900 dark:to-transparent
                                dark:before:absolute dark:before:inset-0 dark:before:bg-[repeating-linear-gradient(135deg,rgba(59,130,246,0.08)_0_8px,transparent_8px_16px)]
                                dark:before:opacity-70 dark:before:pointer-events-none dark:before:rounded-xl
                                border-2 border-blue-400 dark:border-blue-600 rounded-2xl
                            `}
                            style={{ minWidth: 0 }}>
                            {/* Rank */}
                            <div className="flex justify-center items-center gap-2">
                                <span className="text-lg text-blue-700 dark:text-blue-200 font-extrabold drop-shadow">
                                    {currentUserRank.rank}
                                </span>
                            </div>
                            {/* Name */}
                            <div className="flex justify-center items-center gap-3 md:col-span-1 col-span-2">
                                {currentUserRank.avtaar ? (
                                    <img
                                        src={currentUserRank.avtaar}
                                        alt={currentUserRank.fullname}
                                        className="w-8 h-8 rounded-full border-2 border-blue-400 dark:border-blue-600 object-cover shadow"
                                    />
                                ) : (
                                    <User className="w-10 h-10 text-blue-500" />
                                )}
                                <span className="text-blue-900 dark:text-blue-100 font-semibold text-sm truncate max-w-[120px] md:max-w-none">
                                    {currentUserRank.fullname ||
                                        currentUserRank.name}
                                </span>
                            </div>
                            {/* Points */}
                            <div className="text-blue-700 dark:text-blue-200 font-extrabold">
                                {currentUserRank.points ?? 0}
                            </div>
                            {/* Tier */}
                            <div>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        currentUserRank.plan === "premium"
                                            ? "bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200"
                                            : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200"
                                    }`}>
                                    {currentUserRank.plan === "premium"
                                        ? "Premium"
                                        : "Free"}
                                </span>
                            </div>
                            {/* Interviews */}
                            <div className="text-blue-700 md:block hidden dark:text-blue-200 font-semibold">
                                {currentUserRank.interviewsCreated ?? 0}
                            </div>
                            {/* Status */}
                            <div className="md:block hidden">
                                <span className="px-2 py-1 rounded-full bg-blue-600 text-white text-xs font-bold shadow">
                                    Current User
                                </span>
                            </div>
                        </li>
                    </div>
                )}
            </div>

            {/* Leaderboard Table */}
            <motion.div
                variants={tableVariant}
                initial="hidden"
                animate="visible"
                className="bg-light-surface dark:bg-dark-bg rounded-2xl shadow-lg overflow-hidden">
                <div className="grid md:grid-cols-6 grid-cols-5 text-center text-gray-500 dark:text-gray-400 w-full py-3 text-sm font-semibold">
                    <span>Rank</span>
                    <span className="md:col-span-1 col-span-2">Name</span>
                    <span>Points</span>
                    <span>Tier</span>
                    <span className="md:block hidden">Interviews</span>
                    <span className="md:block hidden">Status</span>
                </div>
                <ul>
                    {top10.map((user, idx) => (
                        <motion.li
                            variants={childVariant}
                            key={user.id}
                            className={`grid md:grid-cols-6 grid-cols-5 items-center text-center py-4 transition-all duration-300 ${
                                idx < 3
                                    ? `${gradientClasses[idx]} shadow-xl ring-2 ring-inset ring-white/30 dark:ring-black/20`
                                    : "hover:bg-blue-50 dark:hover:bg-gray-800/60"
                            }`}>
                            {/* Rank */}
                            <div className="flex justify-center items-center gap-2">
                                {idx < 3 ? (
                                    <span>{rankIcons[idx]}</span>
                                ) : (
                                    <span className="text-lg text-blue-500 font-bold">
                                        {user.rank ||
                                            users.findIndex(
                                                (u) => u.id === user.id
                                            ) + 1}
                                    </span>
                                )}
                            </div>
                            {/* Name */}
                            <div className="flex justify-center items-center gap-3 md:col-span-1 col-span-2">
                                {user.avtaar ? (
                                    <img
                                        src={user.avtaar}
                                        alt={user.fullname}
                                        className={`w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-700 object-cover ${
                                            idx < 3 ? "scale-110" : ""
                                        }`}
                                    />
                                ) : (
                                    <User
                                        className={`w-9 h-9 text-blue-400 ${
                                            idx < 3 ? "scale-110" : ""
                                        }`}
                                    />
                                )}
                                <span className="text-gray-900 dark:text-white font-semibold text-sm truncate max-w-[120px] md:max-w-none">
                                    {user.fullname || user.name}
                                </span>
                            </div>
                            {/* Points */}
                            <div className="text-yellow-600 dark:text-yellow-300 font-bold">
                                {user.points ?? 0}
                            </div>
                            {/* Tier */}
                            <div>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        user.plan === "premium"
                                            ? "bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200"
                                            : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200"
                                    }`}>
                                    {user.plan === "premium"
                                        ? "Premium"
                                        : "Free"}
                                </span>
                            </div>
                            {/* Interviews */}
                            <div className="text-blue-600 md:block hidden dark:text-blue-300 font-semibold">
                                {user.interviewsCreated ?? 0}
                            </div>
                            {/* Status */}
                            <div className="md:block hidden">
                                {idx === 0 ? (
                                    <span className="px-2 py-1 rounded-full bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 text-xs font-bold animate-pulse">
                                        Top
                                    </span>
                                ) : idx < 3 ? (
                                    <span className="px-2 py-1 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-semibold animate-pulse">
                                        Great
                                    </span>
                                ) : (
                                    <span className="px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs">
                                        Active
                                    </span>
                                )}
                            </div>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>
        </div>
    );
};

export default LeaderboardContent;
