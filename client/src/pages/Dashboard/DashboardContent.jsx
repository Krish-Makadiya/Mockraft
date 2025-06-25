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

    console.log(userData);

    return (
        <div className="flex flex-col gap-10">
            <div className="md:ml-0 ml-12">
                <h1 className="md:text-2xl text-xl font-bold">Dashboard</h1>
                <p className="md:text-sm text-xs text-light-secondary-text dark:text-dark-secondary-text">
                    Track your interview progress and performance
                </p>
            </div>
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
                                    <p className="text-sm text-gray-300">
                                        {" "}
                                        {userData?.points ?? 0} Points
                                    </p>
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                                <span className="inline-flex items-center p-3 rounded-full gap-2 bg-blue-50 dark:bg-blue-900/30 shadow-sm">
                                    <WalletMinimal className="w-6 h-6 text-blue-500" />
                                    <p className="text-sm text-gray-300">
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
        </div>
    );
};

export default DashboardContent;
