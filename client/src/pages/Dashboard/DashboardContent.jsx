import React, { useEffect, useState } from "react";
import {
    User,
    Target,
    TrendingUp,
    Calendar,
    Award,
    Clock,
    BarChart3,
    Star,
    ChevronRight,
    Trophy,
    Zap,
    MessageSquare,
    CheckCircle,
    XCircle,
    AlertCircle,
    MailCheck,
    TrophyIcon,
    WalletMinimal,
    Crown,
    Gift,
    MessagesSquare,
    TrendingUpIcon,
    TargetIcon,
    Clock1,
    Clock4,
    FileText,
} from "lucide-react";
import { doc, getDoc } from "@firebase/firestore";
import { useUser } from "@clerk/clerk-react";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../../config/firebase";
import Loader from "../../components/main/Loader";

const QUESTION_TYPES = [
    "technical",
    "behavioral",
    "system_design",
    "curveball",
];

const useMockInterviewStats = () => {
    const { user } = useUser();
    const [mockInterviews, setMockInterviews] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        last7Days: 0,
        avgScore: 0,
        totalPoints: 0,
        recent: [],
        typeStats: {},
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            const ref = collection(db, "users", user.id, "mock-interviews");
            const snap = await getDocs(ref);
            const data = [];
            snap.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
            setMockInterviews(data);

            // Calculate stats
            const now = new Date();
            const weekAgo = new Date(now);
            weekAgo.setDate(now.getDate() - 7);

            // 1. Total interviews
            const total = data.length;

            // 2. Interviews in past 7 days
            const last7Days = data.filter((mi) =>
                mi.createdAt?.toDate ? mi.createdAt.toDate() >= weekAgo : false
            ).length;

            // 3. Average score of all interviews
            const scores = data
                .map((mi) => mi.analysis?.overallScore)
                .filter((score) => typeof score === "number");
            const avgScore = scores.length
                ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
                : 0;

            // 4. Total points earned
            const totalPoints = data
                .map((mi) => mi.points || 0)
                .reduce((a, b) => a + b, 0);

            // 5. Recent 3 interviews
            const recent = [...data]
                .sort((a, b) =>
                    b.createdAt?.toDate && a.createdAt?.toDate
                        ? b.createdAt.toDate() - a.createdAt.toDate()
                        : 0
                )
                .slice(0, 3);

            // 6. Type stats
            const typeStats = {};
            QUESTION_TYPES.forEach((type) => {
                typeStats[type] = {
                    total: 0,
                    attempted: 0,
                    avgScore: 0,
                    scoreSum: 0,
                };
            });

            data.forEach((mi) => {
                if (Array.isArray(mi.questions)) {
                    mi.questions.forEach((q) => {
                        const type = (q.type || "")
                            .toLowerCase()
                            .replace(" ", "_");
                        if (typeStats[type]) {
                            typeStats[type].total += 1;
                            if (q.answer && q.answer.trim() !== "") {
                                typeStats[type].attempted += 1;
                                if (typeof q.analysis?.score === "number") {
                                    typeStats[type].scoreSum +=
                                        q.analysis.score;
                                }
                            }
                        }
                    });
                }
            });

            // Calculate avgScore for each type
            QUESTION_TYPES.forEach((type) => {
                typeStats[type].avgScore =
                    typeStats[type].attempted > 0
                        ? Math.round(
                              typeStats[type].scoreSum /
                                  typeStats[type].attempted
                          )
                        : 0;
                delete typeStats[type].scoreSum; // Remove temp field
            });

            setStats({
                total,
                last7Days,
                avgScore,
                totalPoints,
                recent,
                typeStats,
            });
        };

        fetchData();
    }, [user]);

    return { mockInterviews, stats };
};

const DashboardContent = () => {
    const { mockInterviews, stats } = useMockInterviewStats();
    const { user } = useUser();
    const [userData, setUserData] = useState(null);
    const [isUserDataLoading, setIsUserDataLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.id) return;
            const userRef = doc(db, "users", user.id);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setUserData(userSnap.data());
            }
            setIsUserDataLoading(false);
        };
        fetchUserData();
    }, [user]);

    if (isUserDataLoading) {
        return <Loader />;
    }

    console.log(stats);

    return (
        <div className="flex flex-col gap-10">
            <div className="md:ml-0 ml-12">
                <h1 className="md:text-2xl text-xl font-bold">Dashboard</h1>
                <p className="md:text-sm text-xs text-light-secondary-text dark:text-dark-secondary-text">
                    Track your interview progress and performance
                </p>
            </div>
            <div className="flex flex-col gap-6">
                <div className="flex flex-row items-center gap-8 bg-light-surface dark:bg-dark-bg p-6 rounded-xl shadow-md transition-transform duration-300 hover:scale-[1.005] hover:shadow-lg w-full mx-auto">
                    <img
                        src={userData?.avtaar || "/default-avatar.png"}
                        alt="User Avatar"
                        className="w-32 h-32 rounded-full object-cover border-3 border-blue-200 dark:border-blue-500 shadow"
                    />
                    <div className="flex-1 flex gap-2 justify-between">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <div className="text-2xl font-bold text-light-primary-text dark:text-dark-primary-text">
                                    {userData?.fullname || "No Name"}
                                </div>
                                <div className="text-base flex gap-2 text-gray-500 dark:text-gray-500">
                                    <MailCheck />
                                    {userData?.email || "No Email"}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex items-center mt-4">
                                    <span className="inline-flex items-center p-3 rounded-full gap-2 bg-yellow-50 dark:bg-yellow-900/30 shadow-sm">
                                        <TrophyIcon className="w-6 h-6 text-yellow-500" />
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {" "}
                                            {userData?.points ?? 0} Points
                                        </p>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-4">
                                    <span className="inline-flex items-center p-3 rounded-full gap-2 bg-blue-50 dark:bg-blue-900/30 shadow-sm">
                                        <WalletMinimal className="w-6 h-6 text-blue-500" />
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {" "}
                                            {userData?.points ?? 0} Coins
                                        </p>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between items-end">
                            <div className="mt-2">
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 font-semibold shadow-sm ">
                                    {userData?.tier === "premium" ? (
                                        <>
                                            <Crown className="w-6 h-6 text-yellow-500" />
                                            Premium
                                        </>
                                    ) : (
                                        <>
                                            <Gift className="w-6 h-6 text-blue-400" />
                                            Free
                                        </>
                                    )}
                                </span>
                            </div>
                            <div className="text-sm text-gray-400 dark:text-gray-500">
                                Joined:{" "}
                                {userData?.createdAt?.toDate
                                    ? userData.createdAt
                                          .toDate()
                                          .toLocaleDateString("en-US", {
                                              day: "numeric",
                                              month: "long",
                                              year: "numeric",
                                          })
                                    : "Unknown"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-[2%]">
                    <div
                        className="flex w-[24%] justify-between p-6 rounded-2xl shadow-md items-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-blue-100 dark:border-blue-900
    bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 dark:from-blue-900 dark:via-blue-800 dark:to-blue-700">
                        <div className="flex flex-col gap-2">
                            <p className="text-lg text-blue-900 dark:text-blue-100 font-semibold">
                                Total Interviews
                            </p>
                            <p className="text-4xl font-bold text-blue-900 dark:text-blue-100">
                                {stats.total}
                            </p>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="p-4 rounded-full bg-blue-300 dark:bg-blue-900 transition-all duration-200 hover:bg-blue-200 dark:hover:bg-blue-800">
                                <MessagesSquare
                                    size={40}
                                    className="text-blue-700 dark:text-blue-200 transition-all duration-200"
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        className="flex w-[24%] justify-between p-6 rounded-2xl shadow-md items-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-green-100 dark:border-green-900
    bg-gradient-to-r from-green-300 via-green-400 to-green-500 dark:from-green-800 dark:via-green-700 dark:to-green-600">
                        <div className="flex flex-col gap-2">
                            <p className="text-lg text-green-900 dark:text-green-100 font-semibold">
                                {/* Example: This Week */}
                                This Week
                            </p>
                            <p className="text-4xl font-bold text-green-900 dark:text-green-100">
                                {stats.last7Days}
                            </p>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="p-4 rounded-full bg-white/40 dark:bg-green-900 transition-all duration-200 hover:bg-green-200 dark:hover:bg-green-800">
                                <TrendingUpIcon
                                    size={40}
                                    className="text-green-700 dark:text-green-200 transition-all duration-200"
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        className="flex w-[24%] justify-between p-6 rounded-2xl shadow-md items-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-yellow-100 dark:border-yellow-900
    bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 dark:from-yellow-800 dark:via-yellow-700 dark:to-yellow-600">
                        <div className="flex flex-col gap-2">
                            <p className="text-lg text-yellow-900 dark:text-yellow-100 font-semibold">
                                Average Score
                            </p>
                            <p className="text-4xl font-bold text-yellow-900 dark:text-yellow-100">
                                {stats.avgScore}%
                            </p>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="p-4 rounded-full bg-white/40 dark:bg-yellow-900 transition-all duration-200 hover:bg-yellow-200 dark:hover:bg-yellow-800">
                                <TargetIcon
                                    size={40}
                                    className="text-yellow-700 dark:text-yellow-200 transition-all duration-200"
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        className="flex w-[24%] justify-between p-6 rounded-2xl shadow-md items-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-purple-100 dark:border-purple-900
    bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 dark:from-purple-900 dark:via-purple-800 dark:to-purple-700">
                        <div className="flex flex-col gap-2">
                            <p className="text-lg text-purple-900 dark:text-purple-100 font-semibold">
                                Points Earned
                            </p>
                            <p className="text-4xl font-bold text-purple-900 dark:text-purple-100">
                                {stats.totalPoints}
                            </p>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="p-4 rounded-full bg-white/40 dark:bg-purple-900 transition-all duration-200 hover:bg-purple-200 dark:hover:bg-purple-800">
                                <Trophy
                                    size={40}
                                    className="text-purple-700 dark:text-purple-200 transition-all duration-200"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-[2%]">
                    <div className="w-[49%] bg-light-surface dark:bg-dark-bg rounded-xl p-6 flex flex-col">
                        <div className="flex items-center gap-4">
                            <div className="bg-light-bg dark:bg-dark-surface p-3 rounded-full shadow-sm">
                                <Clock4 size={30} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-xl font-semibold">Recent Interviews</p>
                                <p className="text-light-secondary-text">
                                    Your latest mock interview sessions
                                </p>
                            </div>
                        </div>
                        <div>
                            {stats.recent.length > 0 ? (
                                <ul className="mt-4 space-y-4">
                                    {stats.recent.map((interview) => (
                                        <li
                                            key={interview.id}
                                            className="flex items-center justify-between p-4 bg-light-bg dark:bg-dark-surface rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                                            <div className="flex items-center gap-3">
                                                <FileText size={24} />
                                                <div>
                                                    <p className="font-semibold">
                                                        {interview.title ||
                                                            "Mock Interview"}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {interview.createdAt
                                                            ?.toDate
                                                            ? interview.createdAt
                                                                  .toDate()
                                                                  .toLocaleDateString(
                                                                      "en-US",
                                                                      {
                                                                          day: "numeric",
                                                                          month: "long",
                                                                          year: "numeric",
                                                                      }
                                                                  )
                                                            : "Unknown Date"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                                    Score:{" "}
                                                    {interview.analysis
                                                        ?.overallScore
                                                        ? `${interview.analysis.overallScore}%`
                                                        : "N/A"}
                                                </span>
                                                <ChevronRight size={20} />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 mt-4">
                                    No recent interviews found.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;
