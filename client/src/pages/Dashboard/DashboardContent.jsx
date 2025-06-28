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
    ChartBar,
    Gauge,
    Sprout,
    NotebookPen,
    Pickaxe,
    LayoutTemplate,
    Atom,
    Medal,
    ShieldCheck,
} from "lucide-react";
import { doc, getDoc } from "@firebase/firestore";
import { useUser } from "@clerk/clerk-react";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../../config/firebase";
import Loader from "../../components/main/Loader";
import {
    RankProgressBar,
    RANKS,
} from "../../components/Dashboard/RankProgressBar";
import { useNavigate } from "react-router-dom";

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

const DashboardContent = () => {
    const { mockInterviews, stats } = useMockInterviewStats();
    const { user } = useUser();
    const [userData, setUserData] = useState(null);
    const [isUserDataLoading, setIsUserDataLoading] = useState(true);
    const navigate = useNavigate();

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

    const userPoints = userData?.points || 0;
    const currentRankIndex = RANKS.findIndex(
        (rank) => userPoints >= rank.minPoints && userPoints <= rank.maxPoints
    );

    return (
        <div className="flex flex-col gap-10 md:px-4 px-2">
            <div className="md:ml-0 ml-12">
                <h1 className="md:text-3xl text-xl font-bold">Dashboard</h1>
                <p className="md:text-sm text-xs text-light-secondary-text dark:text-dark-secondary-text">
                    Track your interview progress and performance
                </p>
            </div>
            <div className="flex flex-col gap-6">
                <div className="flex md:flex-row flex-col items-center md:gap-8 gap-3 bg-light-surface dark:bg-dark-bg p-6 rounded-xl shadow-md transition-transform duration-300 hover:scale-[1.005] hover:shadow-lg w-full mx-auto">
                    <img
                        src={userData?.avtaar || "/default-avatar.png"}
                        alt="User Avatar"
                        className="w-32 h-32 rounded-full object-cover border-3 border-blue-200 dark:border-blue-500 shadow"
                    />
                    <div className="flex-1 flex md:flex-row flex-col gap-4 justify-between">
                        <div className="flex flex-col md:items-start items-center md:gap-3 gap-2">
                            <div className="flex flex-col gap-1 md:items-start items-center">
                                <div className="text-2xl font-bold text-light-primary-text dark:text-dark-primary-text">
                                    {userData?.fullname || "No Name"}
                                </div>
                                <div className="text-base flex items-center md:gap-2 gap-1 text-gray-500 dark:text-gray-500">
                                    <MailCheck className="md:w-6 md:h-6 w-4 h-4" />
                                    {userData?.email || "No Email"}
                                </div>
                            </div>
                            <span
                                className={`inline-flex w-fit items-center gap-2 px-4 py-2 rounded-full font-semibold shadow-sm
                                        ${
                                            userData?.plan === "premium"
                                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200"
                                                : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
                                        }
                                    `}>
                                {userData?.plan === "premium" ? (
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
                        <div className="flex flex-col justify-between items-end">
                            <div className="flex gap-3 w-full justify-center">
                                <div className="flex items-center">
                                    <span className="inline-flex items-center p-3 rounded-full gap-2 bg-yellow-50 dark:bg-yellow-900/30 shadow-sm">
                                        <TrophyIcon className="w-6 h-6 text-yellow-500" />
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {" "}
                                            {userData?.points ?? 0} Points
                                        </p>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center p-3 rounded-full gap-2 bg-blue-50 dark:bg-blue-900/30 shadow-sm">
                                        <WalletMinimal className="w-6 h-6 text-blue-500" />
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {" "}
                                            {userData?.coins ?? 0} Coins
                                        </p>
                                    </span>
                                </div>
                            </div>
                            <div className="text-sm text-gray-400 dark:text-gray-500 md:text-end text-center w-full mt-4">
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
                            `}>
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
                            `}>
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
                    <div className=" text-gray-500 dark:text-gray-400">
                        You are currently at{" "}
                        <span className="font-bold text-yellow-600 dark:text-yellow-300">
                            {RANKS[currentRankIndex].name}
                        </span>{" "}
                        rank with{" "}
                        <span className="font-bold">{userPoints}</span> points.
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                    <div
                        className="flex justify-between md:p-6 p-3 rounded-2xl shadow-md items-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-blue-100 dark:border-blue-900
                        bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 dark:from-blue-900 dark:via-blue-800 dark:to-blue-700">
                        <div className="flex flex-col gap-2">
                            <p className="md:text-lg text-sm text-blue-900 dark:text-blue-100 font-semibold">
                                Total Interviews
                            </p>
                            <p className="text-4xl font-bold text-blue-900 dark:text-blue-100">
                                {stats.total}
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
                                {stats.last7Days}
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
                                {stats.avgScore}%
                            </p>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="p-4 rounded-full bg-white/40 dark:bg-yellow-900 transition-all duration-200 hover:bg-yellow-200 dark:hover:bg-yellow-800">
                                <TargetIcon className="text-yellow-700 dark:text-yellow-200 transition-all duration-200 md:h-10 md:w-10 h-6 w-6" />
                            </div>
                        </div>
                    </div>
                    <div
                        className="flex justify-between  md:p-6 p-3 rounded-2xl shadow-md items-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-purple-100 dark:border-purple-900
                        bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 dark:from-purple-900 dark:via-purple-800 dark:to-purple-700">
                        <div className="flex flex-col gap-2">
                            <p className="md:text-lg text-sm text-purple-900 dark:text-purple-100 font-semibold">
                                Points Earned
                            </p>
                            <p className="text-4xl font-bold text-purple-900 dark:text-purple-100">
                                {userData?.points || 0}
                            </p>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="p-4 rounded-full bg-white/40 dark:bg-purple-900 transition-all duration-200 hover:bg-purple-200 dark:hover:bg-purple-800">
                                <Trophy className="text-purple-700 dark:text-purple-200 transition-all duration-200 md:h-10 md:w-10 h-6 w-6" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex md:flex-row flex-col md:gap-[2%] gap-4">
                    <div className="md:w-[49%] w-full bg-light-surface dark:bg-dark-bg rounded-xl p-6 flex flex-col shadow-md transition-transform duration-300 hover:scale-[1.005] hover:shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="bg-light-bg dark:bg-dark-surface p-3 rounded-full shadow-sm">
                                <Clock4 size={30} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-2xl font-semibold">
                                    Recent Interviews
                                </p>
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
                                            className="flex items-center justify-between p-4 bg-light-bg dark:bg-dark-surface rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                                            onClick={() =>
                                                interview.isCompleted
                                                    ? navigate(
                                                          `/${userData.id}/mock-interview/${interview.id}/analysis`
                                                      )
                                                    : navigate(
                                                          `/${userData.id}/mock-interview/${interview.id}`
                                                      )
                                            }>
                                            <div className="flex items-center gap-3">
                                                <FileText size={24} />
                                                <div>
                                                    <p className="font-semibold">
                                                        {interview.interviewName ||
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
                                            <div className="flex items-center gap-3">
                                                {/* Status indicator */}
                                                {interview.isCompleted ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 text-xs font-semibold">
                                                        <CheckCircle className="w-4 h-4" />
                                                        Completed
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 text-xs font-semibold">
                                                        <Clock className="w-4 h-4" />
                                                        Ongoing
                                                    </span>
                                                )}

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
                                <p className="text-gray-500 dark:text-gray-400 my-36 text-center">
                                    No recent interviews found.
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="md:w-[49%] w-full bg-light-surface dark:bg-dark-bg rounded-xl p-6 flex flex-col shadow-md transition-transform duration-300 hover:scale-[1.005] hover:shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="bg-light-bg dark:bg-dark-surface p-3 rounded-full shadow-sm">
                                <ChartBar size={30} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-2xl font-semibold">
                                    Performance Analysis{" "}
                                </p>
                                <p className="text-light-secondary-text">
                                    Breakdown by question categories
                                </p>
                            </div>
                        </div>
                        <div>
                            {Object.keys(stats.typeStats).length > 0 ? (
                                <ul className="mt-4 space-y-4">
                                    {QUESTION_TYPES.map((type) => {
                                        const typeStat =
                                            stats.typeStats[type] || {};
                                        const avg = typeStat.avgScore || 0;
                                        return (
                                            <li
                                                key={type}
                                                className="flex items-center justify-between p-4 bg-light-bg dark:bg-dark-surface rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                                                <div className="flex items-center gap-3">
                                                    <Gauge size={24} />
                                                    <div>
                                                        <p className="font-semibold capitalize">
                                                            {type.replace(
                                                                "_",
                                                                " "
                                                            )}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            Total:{" "}
                                                            {typeStat.total} <br />
                                                            Attempted:{" "}
                                                            {typeStat.attempted}
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
                </div>

                <RankProgressBar points={userData?.points || 0} />

                <div className="flex md:flex-row flex-col md:gap-[2%] gap-4">
                    {/* Highlight: Why Buy Paid Plan */}
                    <div className="md:w-[49%] w-full bg-gradient-to-br from-yellow-100 via-yellow-50 to-white dark:from-yellow-900/40 dark:via-yellow-900/10 dark:to-gray-900 border-2 border-yellow-300 dark:border-yellow-800 rounded-xl p-6 shadow-xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Crown className="w-8 h-8 text-yellow-500" />
                                <span className="text-xl font-bold text-yellow-800 dark:text-yellow-200">
                                    Unlock Premium Features!
                                </span>
                            </div>
                            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200 text-sm mb-4">
                                <li>Unlimited mock interviews & AI feedback</li>
                                <li>Priority support & early feature access</li>
                                <li>Exclusive resources and community</li>
                            </ul>
                            <div className="text-base font-semibold text-yellow-700 dark:text-yellow-200 mb-4">
                                Invest in your career. Stand out from the crowd.
                            </div>
                        </div>
                        <button className="mt-2 px-6 py-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold shadow transition">
                            Upgrade Now
                        </button>
                    </div>
                    {/* Contact Card */}
                    <div className="md:w-[49%] w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-900/40 dark:via-blue-900/10 dark:to-gray-900 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 shadow-xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <MailCheck className="w-8 h-8 text-blue-500" />
                                <span className="text-xl font-bold text-blue-800 dark:text-blue-200">
                                    Need Help? Contact Us!
                                </span>
                            </div>
                            <div className="text-gray-700 dark:text-gray-200 text-sm mb-4">
                                Our support team is here for you. Reach out for
                                any queries, feedback, or issues.
                            </div>
                            <div className="flex flex-col gap-1 text-sm">
                                <span>
                                    <span className="font-semibold">
                                        Email:
                                    </span>{" "}
                                    <a
                                        href="mailto:support@careerly.com"
                                        className="text-blue-600 hover:underline">
                                        support@careerly.com
                                    </a>
                                </span>
                                <span>
                                    <span className="font-semibold">
                                        Phone:
                                    </span>{" "}
                                    <a
                                        href="tel:+1234567890"
                                        className="text-blue-600 hover:underline">
                                        +1 234 567 890
                                    </a>
                                </span>
                                <span>
                                    <span className="font-semibold">
                                        Live Chat:
                                    </span>{" "}
                                    <a
                                        href="/support"
                                        className="text-blue-600 hover:underline">
                                        Start Chat
                                    </a>
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                            We usually respond within 24 hours.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;
