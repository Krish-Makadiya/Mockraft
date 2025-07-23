import { useUser } from "@clerk/clerk-react";
import { collection, doc, getDoc, getDocs } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PerformanceAnalysisSection from "../../components/Dashboard/PerformanceAnalysisSection";
import PremiumHighlightCard from "../../components/Dashboard/PremiumHighlightCard";
import RankLevelSection from "../../components/Dashboard/RankLevelSection";
import { RankProgressBar } from "../../components/Dashboard/RankProgressBar";
import RecentInterviewsSection from "../../components/Dashboard/RecentInterviewsSection";
import StatsOverviewGrid from "../../components/Dashboard/StatsOverviewGrid";
import SupportContactCard from "../../components/Dashboard/SupportContactCard";
import UserProfileCard from "../../components/Dashboard/UserProfileCard";
import Loader from "../../components/main/Loader";
import { db } from "../../config/firebase";
import { motion } from "framer-motion"; // <-- Add this import

const QUESTION_TYPES = [
    "technical",
    "behavioral",
    "system_design",
    "curveball",
];

// Animation configs
const containerStagger = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05,
        },
    },
};
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, type: "spring", stiffness: 300 },
    },
};

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

    return (
        <motion.div
            className="flex flex-col gap-10 md:px-4 px-2"
            variants={containerStagger}
            initial="hidden"
            animate="visible">
            <motion.div className="md:ml-0 ml-12" variants={fadeUp}>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="md:text-sm text-xs text-light-secondary-text dark:text-dark-secondary-text">
                    Track your interview progress and performance
                </p>
            </motion.div>

            <motion.div
                className="flex flex-col gap-6"
                variants={containerStagger}>
                <motion.div variants={fadeUp}>
                    <UserProfileCard userData={userData} />
                </motion.div>
                <motion.div variants={fadeUp}>
                    <RankLevelSection userPoints={userData?.points || 0} />
                </motion.div>
                <motion.div variants={fadeUp}>
                    <StatsOverviewGrid
                        total={stats.total}
                        last7Days={stats.last7Days}
                        avgScore={stats.avgScore}
                        points={userData?.points || 0}
                    />
                </motion.div>

                <motion.div
                    className="flex md:flex-row flex-col md:gap-[2%] gap-4"
                    variants={fadeUp}>
                    <RecentInterviewsSection
                        recentInterviews={stats.recent}
                        userId={userData.id}
                        navigate={navigate}
                    />
                    <PerformanceAnalysisSection
                        typeStats={stats.typeStats}
                        questionTypes={QUESTION_TYPES}
                    />
                </motion.div>

                <motion.div variants={fadeUp}>
                    <RankProgressBar points={userData?.points || 0} />
                </motion.div>

                <motion.div
                    className="flex md:flex-row flex-col md:gap-[2%] gap-4"
                    variants={fadeUp}>
                    <PremiumHighlightCard buttonLabel="Upgrade to Premium" />
                    <SupportContactCard />
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default DashboardContent;
