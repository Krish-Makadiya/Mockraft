import { useUser } from "@clerk/clerk-react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { FilePlus2, FileUser, ListFilter } from "lucide-react";
import { useEffect, useState } from "react";
import EmptyDialog from "../../components/main/EmptyDialog";
import Loader from "../../components/main/Loader";
import FilterMenuSection from "../../components/MockInterview/FilterMenuSection";
import MockInterviewCard from "../../components/MockInterview/MockInterviewCard";
import { db } from "../../config/firebase";
import { motion, stagger } from "framer-motion";

const MockInterviewHomepage = ({ isCreateModalOpen, setIsCreateModalOpen }) => {
    const [allInterviews, setAllInterviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: "all",
        level: "all",
        technology: "all",
        language: "all",
        sort: "newest",
    });
    const [isStarred, setIsStarred] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            const response = await getDocs(
                query(
                    collection(db, `users/${user.id}/mock-interviews`),
                    orderBy("createdAt", "desc")
                )
            );

            const interviews = response.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAtMs: doc.data().createdAt?.seconds * 1000 || Date.now(),
            }));
            console.log(interviews);
            setAllInterviews(interviews);
        } catch (error) {
            setError("Failed to fetch interviews. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div>
                <Loader />
            </div>
        );
    }

    const getFilteredInterviews = () => {
        return allInterviews
            .filter((interview) => {
                if (isStarred && !interview.isBookmarked) {
                    return false;
                }

                // Only apply other filters if the interview passed the starred check
                const statusMatch =
                    filters.status === "all" ||
                    (filters.status === "completed" && interview.isCompleted) ||
                    (filters.status === "in-progress" &&
                        !interview.isCompleted);

                const levelMatch =
                    filters.level === "all" ||
                    interview.experienceLevel === filters.level;

                const techMatch =
                    filters.technology === "all" ||
                    interview.technologyStack === filters.technology;

                const langMatch =
                    filters.language === "all" ||
                    interview.programmingLanguage === filters.language;

                return statusMatch && levelMatch && techMatch && langMatch;
            })
            .sort((a, b) => {
                if (filters.sort === "newest") {
                    return b.createdAtMs - a.createdAtMs;
                }
                return a.createdAtMs - b.createdAtMs;
            });
    };

    const handleBookmarkToggle = (id, newValue) => {
        setAllInterviews((prev) =>
            prev.map((interview) =>
                interview.id === id
                    ? { ...interview, isBookmarked: newValue }
                    : interview
            )
        );
    };

    const parentVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.05,
            },
        },
    };
    const childVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3, type: "spring", stiffness: 300 },
        },
    };

    return (
        <motion.div
            variants={parentVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col min-h-screen bg-light-bg dark:bg-dark-surface text-light-primary-text dark:text-dark-primary-text gap-10 px-4">
            <motion.div
                variants={childVariants}
                className="flex justify-between items-center gap-10">
                <div className="md:ml-0 ml-12">
                    <h1 className="text-3xl font-bold">Mock Interview</h1>
                    <p className="md:text-sm text-xs text-light-secondary-text dark:text-dark-secondary-text">
                        Prepare for your next interview with our mock interview
                        sessions.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary md:px-4 md:py-3 px-2 py-1 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Create new mock interview">
                    <FilePlus2
                        className="relative md:h-6 h-10 md:w-6 w-10 text-white transition-transform duration-200 
                                                ease-out group-hover:scale-[1.02]"
                    />

                    <span className="relative hidden font-medium text-white sm:inline-block">
                        New Aptitude
                    </span>
                </button>
            </motion.div>

            {allInterviews.length > 0 ? (
                <div className="flex flex-col gap-4 items-center">
                    <motion.div
                        variants={childVariants}
                        className="w-full flex justify-end gap-2">
                        <FilterMenuSection
                            filters={filters}
                            setFilters={setFilters}
                            isStarred={isStarred}
                            setIsStarred={setIsStarred}
                        />
                    </motion.div>
                    {getFilteredInterviews().length > 0 ? (
                        <motion.div
                            variants={childVariants}
                            className="w-full space-y-3">
                            {getFilteredInterviews().map((interview) => (
                                <MockInterviewCard
                                    key={interview.id}
                                    interview={interview}
                                    onBookmarkToggle={handleBookmarkToggle}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={childVariants}
                            className="w-full flex flex-col items-center justify-center py-20 text-center">
                            <div className="bg-light-surface/50 dark:bg-dark-surface/50 rounded-lg p-8">
                                <ListFilter className="h-12 w-12 mx-auto text-neutral-400 mb-3" />
                                <h3 className="text-lg font-medium text-light-primary-text dark:text-dark-primary-text mb-2">
                                    No matches found
                                </h3>
                                <p className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                                    Try adjusting your filters or create a new
                                    interview
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>
            ) : (
                <div className="w-full mt-40 flex justify-center items-center">
                    <EmptyDialog
                        icon={<FileUser size={60} />}
                        text="Create a new Mock Interview"
                        onClick={() => setIsCreateModalOpen(true)}
                    />
                </div>
            )}
        </motion.div>
    );
};

export default MockInterviewHomepage;
