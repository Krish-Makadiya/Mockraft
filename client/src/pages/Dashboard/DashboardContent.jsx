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
import axios from "axios";

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

    return { mockInterviews, stats };
};

const DashboardContent = () => {
    const { user } = useUser();
    const [userData, setUserData] = useState(null);
    const [isUserDataLoading, setIsUserDataLoading] = useState(true);
    const navigate = useNavigate();
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
        if (!user.id) return;

        const fetchStats = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/mock-interview/mock-stats/${user.id}`
                );
                console.log(res.data);
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch mock stats:", err);
            }
        };

        fetchStats();
    }, [user.id]);

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
