import { useUser } from "@clerk/clerk-react";
import { Popover, Transition } from "@headlessui/react";
import {
    collection,
    doc,
    getDocs,
    orderBy,
    query,
    updateDoc,
} from "firebase/firestore";
import {
    Briefcase,
    Clock,
    Code,
    FilePlus2,
    FileUser,
    Filter,
    Layers,
    ListFilter,
    SquarePlus,
    Star,
    X,
} from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import EmptyDialog from "../../components/main/EmptyDialog";
import Loader from "../../components/main/Loader";
import { db } from "../../config/firebase";

const MockInterviewCard = ({ interview }) => {
    const { user } = useUser();
    const [isBookmarked, setIsBookmarked] = useState(interview.isBookmarked);
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate();

    const bookmarkHandler = async (e) => {
        e.stopPropagation();

        if (isUpdating) return; // Prevent multiple rapid clicks

        try {
            setIsUpdating(true);
            const interviewRef = doc(
                db,
                `users/${user.id}/mock-interviews`,
                interview.id
            );

            await updateDoc(interviewRef, {
                isBookmarked: !isBookmarked,
            });
            setIsBookmarked(!isBookmarked);

            toast.success(
                !isBookmarked ? "Added to favorites" : "Removed from favorites"
            );
        } catch (error) {
            console.error("Error updating bookmark:", error);
            toast.error("Failed to update bookmark. Please try again.");

            setIsBookmarked(isBookmarked);
        } finally {
            setIsUpdating(false);
        }
    };

    const getLevelClass = (level) => {
        switch (level) {
            case "Entry":
                return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400";
            case "Senior":
                return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
            default: // Mid
                return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400";
        }
    };

    const interviewCardHandler = () => {
        console.log(interview);
        if (interview.isCompleted) {
            navigate(`/${user.id}/mock-interview/${interview.id}/analysis`);
        } else {
            navigate(`/${user.id}/mock-interview/${interview.id}`);
        }
    };

    return (
        <div
            onClick={() => interviewCardHandler()}
            className="group w-full bg-white dark:bg-dark-bg rounded-lg shadow-sm border border-light-surface dark:border-dark-surface md:p-4 p-3 hover:shadow-md duration-200 transition-all hover:scale-[100.5%] cursor-pointer">
            <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-light-primary/20 to-light-primary/10 dark:from-dark-primary/20 dark:to-dark-primary/10 p-3 rounded-lg">
                    <Briefcase className="w-5 h-5 text-light-primary dark:text-dark-primary" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium text-light-primary-text dark:text-dark-primary-text truncate">
                            {interview.interviewName || "Untitled Interview"}
                        </h3>
                        <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                            ${getLevelClass(
                                interview.experienceLevel
                            )} bg-opacity-10 backdrop-blur-sm`}>
                            {interview.experienceLevel || "Mid"} Level
                        </span>
                    </div>

                    <p className="mt-1 md:text-sm text-xs text-light-secondary-text md:max-w-[90%] max-w-[90%] dark:text-dark-secondary-text line-clamp-2">
                        {interview.jobDescription || "No description provided"}
                    </p>

                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <div className="mt-3 flex flex-wrap gap-2">
                                <div className="inline-flex items-center text-xs bg-gradient-to-r from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 px-2 py-1 rounded-md">
                                    <Code className="w-3 h-3 mr-1 text-light-primary dark:text-dark-primary" />
                                    {interview.programmingLanguage ||
                                        "Not specified"}
                                </div>

                                <span className="inline-flex items-center text-xs bg-gradient-to-r from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 px-2 py-1 rounded-md">
                                    <Layers className="w-3 h-3 mr-1 text-light-primary dark:text-dark-primary" />
                                    {interview.technologyStack ||
                                        "Not specified"}
                                </span>
                            </div>

                            <div className="flex items-center mt-3 gap-3">
                                <div className="flex items-center text-xs text-light-secondary-text/70 dark:text-dark-secondary-text/70">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Created{" "}
                                    {interview.createdAt?.seconds
                                        ? new Date(
                                              interview.createdAt.seconds * 1000
                                          ).toLocaleDateString("en-US", {
                                              year: "numeric",
                                              month: "short",
                                              day: "numeric",
                                          })
                                        : "recently"}
                                </div>
                                <div className="flex items-center gap-1">
                                    <div
                                        className={`h-2 w-2 rounded-full ${
                                            interview.isCompleted
                                                ? "bg-gradient-to-r from-green-400 to-green-500"
                                                : "bg-gradient-to-r from-yellow-400 to-yellow-500"
                                        }`}
                                    />
                                    <span className="text-xs text-light-secondary-text dark:text-dark-secondary-text">
                                        {interview.isCompleted
                                            ? "Completed"
                                            : "In Progress"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="md:px-5 px-3">
                            <Star
                                onClick={bookmarkHandler}
                                size={25}
                                className={`text-yellow-500 dark:text-yellow-400 cursor-pointer
                transition-all duration-200   group-hover:opacity-100 group-hover:scale-105 ${
                    isUpdating ? "opacity-50" : "hover:scale-110"
                } 
                ${
                    isBookmarked &&
                    "fill-yellow-500 dark:fill-yellow-400 opacity-100"
                }`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FilterMenu = ({ filters, setFilters }) => {
    const isFiltersActive = () => {
        return (
            filters.status !== "all" ||
            filters.level !== "all" ||
            filters.technology !== "all" ||
            filters.language !== "all" ||
            filters.sort !== "newest"
        );
    };

    // Add this function to reset filters
    const resetFilters = () => {
        setFilters({
            status: "all",
            level: "all",
            technology: "all",
            language: "all",
            sort: "newest",
        });
    };

    return (
        <Popover className="relative">
            {({ open, close }) => (
                <>
                    <div className="flex items-center gap-2">
                        {isFiltersActive() && (
                            <button
                                onClick={resetFilters}
                                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-light-fail dark:text-dark-fail hover:bg-light-fail/10 dark:hover:bg-dark-fail/10 rounded-lg transition-all duration-200">
                                <X className="h-4 w-4" />
                                Reset
                            </button>
                        )}
                        <Popover.Button
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm transition-all duration-200
                                ${
                                    open
                                        ? "bg-light-primary/10 dark:bg-dark-primary/10 text-light-primary dark:text-dark-primary"
                                        : "bg-white dark:bg-dark-bg hover:bg-light-surface dark:hover:bg-dark-surface"
                                }
                                ${
                                    isFiltersActive() &&
                                    "ring-2 ring-light-primary dark:ring-dark-primary"
                                }`}>
                            <Filter className="h-4 w-4" />
                            <span className="text-sm font-medium">
                                {isFiltersActive()
                                    ? `Filters (${
                                          Object.values(filters).filter(
                                              (value) =>
                                                  value !== "all" &&
                                                  value !== "newest"
                                          ).length
                                      })`
                                    : "Filters"}
                            </span>
                        </Popover.Button>
                    </div>

                    <Transition
                        as={Fragment}
                        enter="transition duration-200 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-150 ease-in"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0">
                        <Popover.Panel className="absolute right-0 z-50 mt-2 w-80 origin-top-right">
                            <div className="bg-white dark:bg-dark-bg rounded-xl shadow-lg ring-1 ring-black/5 p-6 space-y-4">
                                {/* Status Filter */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-light-secondary-text dark:text-dark-secondary-text">
                                        Status
                                    </label>
                                    <select
                                        value={filters.status}
                                        onChange={(e) => {
                                            setFilters((prev) => ({
                                                ...prev,
                                                status: e.target.value,
                                            }));
                                            close();
                                        }}
                                        className="w-full px-3 py-2 text-sm rounded-lg bg-light-surface dark:bg-dark-surface border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary">
                                        <option value="all">All Status</option>
                                        <option value="completed">
                                            Completed
                                        </option>
                                        <option value="in-progress">
                                            In Progress
                                        </option>
                                    </select>
                                </div>

                                {/* Level Filter */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-light-secondary-text dark:text-dark-secondary-text">
                                        Experience Level
                                    </label>
                                    <select
                                        value={filters.level}
                                        onChange={(e) => {
                                            setFilters((prev) => ({
                                                ...prev,
                                                level: e.target.value,
                                            }));
                                            close();
                                        }}
                                        className="w-full px-3 py-2 text-sm rounded-lg bg-light-surface dark:bg-dark-surface border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary">
                                        <option value="all">All Levels</option>
                                        <option value="Entry">
                                            Entry Level
                                        </option>
                                        <option value="Mid">Mid Level</option>
                                        <option value="Senior">
                                            Senior Level
                                        </option>
                                    </select>
                                </div>

                                {/* Technology Filter */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-light-secondary-text dark:text-dark-secondary-text">
                                        Technology
                                    </label>
                                    <select
                                        value={filters.technology}
                                        onChange={(e) => {
                                            setFilters((prev) => ({
                                                ...prev,
                                                technology: e.target.value,
                                            }));
                                            close();
                                        }}
                                        className="w-full px-3 py-2 text-sm rounded-lg bg-light-surface dark:bg-dark-surface border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary">
                                        <option value="all">
                                            All Technologies
                                        </option>
                                        <option value="Frontend">
                                            Frontend
                                        </option>
                                        <option value="Backend">Backend</option>
                                        <option value="Fullstack">
                                            Full Stack
                                        </option>
                                        <option value="Mobile">Mobile</option>
                                        <option value="Devops">DevOps</option>
                                    </select>
                                </div>

                                {/* Language Filter */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-light-secondary-text dark:text-dark-secondary-text">
                                        Programming Language
                                    </label>
                                    <select
                                        value={filters.language}
                                        onChange={(e) => {
                                            setFilters((prev) => ({
                                                ...prev,
                                                language: e.target.value,
                                            }));
                                            close();
                                        }}
                                        className="w-full px-3 py-2 text-sm rounded-lg bg-light-surface dark:bg-dark-surface border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary">
                                        <option value="all">
                                            All Languages
                                        </option>
                                        <option value="Javascript">
                                            JavaScript
                                        </option>
                                        <option value="Python">Python</option>
                                        <option value="Java">Java</option>
                                        <option value="C++">C++</option>
                                        <option value="C#">C#</option>
                                    </select>
                                </div>

                                {/* Sort Order */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-light-secondary-text dark:text-dark-secondary-text">
                                        Sort By
                                    </label>
                                    <select
                                        value={filters.sort}
                                        onChange={(e) => {
                                            setFilters((prev) => ({
                                                ...prev,
                                                sort: e.target.value,
                                            }));
                                            close();
                                        }}
                                        className="w-full px-3 py-2 text-sm rounded-lg bg-light-surface dark:bg-dark-surface border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary">
                                        <option value="newest">
                                            Newest First
                                        </option>
                                        <option value="oldest">
                                            Oldest First
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

const StarredButton = ({ isStarred, setIsStarred }) => {
    return (
        <button onClick={() => setIsStarred(!isStarred)}>
            <Star
                className={`h-7 w-7 ${
                    isStarred
                        ? "text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400"
                        : "ext-yellow-500 dark:text-yellow-400"
                }`}
            />
        </button>
    );
};

const MockInterviewHomepage = ({ isCreateModalOpen, setIsCreateModalOpen }) => {
    const [allInterviews, setAllInterviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: "all", // all, completed, in-progress
        level: "all", // all, Entry, Mid, Senior
        technology: "all", // all, Frontend, Backend, etc.
        language: "all", // all, Javascript, Python, etc.
        sort: "newest", // newest, oldest
    });

    const { user } = useUser();

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

    useEffect(() => {
        fetchInterviews();
    }, []);

    const [isStarred, setIsStarred] = useState(false);

    if (isLoading) {
        return (
            <div>
                <Loader />
            </div>
        );
    }

    const handleInterviewUpdate = (id, updates) => {
        setAllInterviews((interviews) =>
            interviews.map((interview) =>
                interview.id === id ? { ...interview, ...updates } : interview
            )
        );
    };

    const getFilteredInterviews = () => {
        return allInterviews
            .filter((interview) => {
                // First check if starred filter is active
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

    return (
        <div className="flex flex-col min-h-screen bg-light-bg dark:bg-dark-surface text-light-primary-text dark:text-dark-primary-text gap-10 px-4">
            <div className="flex justify-between items-center gap-10">
                <div className="md:ml-0 ml-12">
                    <h1 className="md:text-2xl text-xl font-bold">Mock Interviews</h1>
                    <p className="md:text-sm text-xs text-light-secondary-text dark:text-dark-secondary-text">
                        Prepare for your next interview with our mock interview
                        sessions.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary md:px-4 px-2 md:py-3 py-2 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Create new mock interview">
                    <span className="absolute inset-0 bg-gradient-to-r from-light-secondary to-light-primary dark:from-dark-secondary dark:to-dark-primary  opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"></span>

                    <FilePlus2
                        className="relative md:h-6 h-10 md:w-6 w-10 text-white transition-transform duration-200 
                                                ease-out group-hover:scale-[1.02]"
                    />

                    <span className="relative hidden font-medium text-white sm:inline-block">
                        New Interview
                    </span>
                </button>
            </div>

            {allInterviews.length > 0 ? (
                <div className="flex flex-col gap-4 items-center">
                    <div className="w-full flex justify-end gap-2">
                        <FilterMenu filters={filters} setFilters={setFilters} />
                        <StarredButton
                            isStarred={isStarred}
                            setIsStarred={setIsStarred}
                        />
                    </div>
                    {getFilteredInterviews().length > 0 ? (
                        <div className="w-full max-w-7xl space-y-3">
                            {getFilteredInterviews().map((interview) => (
                                <MockInterviewCard
                                    key={interview.id}
                                    interview={{
                                        id: interview.id,
                                        ...interview,
                                    }}
                                    onUpdate={handleInterviewUpdate}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="w-full flex flex-col items-center justify-center py-20 text-center">
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
                        </div>
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
        </div>
    );
};

export default MockInterviewHomepage;
