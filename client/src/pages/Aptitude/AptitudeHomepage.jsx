import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { db } from "../../config/firebase";
import {
    collection,
    getDocs,
    setDoc,
    doc,
    updateDoc,
    increment,
    serverTimestamp,
    getDoc,
} from "firebase/firestore";
import {
    Check,
    Info,
    BookOpen,
    Brain,
    MessageSquare,
    BarChart,
    Star,
    Lock,
    Filter,
    X,
    ListFilter,
} from "lucide-react";
import Loader from "../../components/main/Loader";
import { Popover, Transition } from "@headlessui/react";
import { motion } from "framer-motion";

const QUESTIONS_PER_PAGE = 5;

const getColorClass = (isCorrect, answered) => {
    if (!answered) return "";
    if (isCorrect)
        return "border-light-success dark:border-dark-success bg-dark-success/10 dark:bg-dark-success/10";
    return "border-light-fail dark:border-dark-fail bg-light-fail/10 dark:bg-dark-fail/10";
};

const AptitudeAllQuestionHomepage = ({}) => {
    const [questions, setQuestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [answers, setAnswers] = useState({}); // { [id]: selectedOption }
    const [showExplanation, setShowExplanation] = useState({}); // { [id]: bool }
    const [loading, setLoading] = useState(true);
    const [solvedQuestions, setSolvedQuestions] = useState({}); // { [id]: { correct, selectedOption } }
    const { user, isLoaded } = useUser();
    const [typeCounts, setTypeCounts] = useState({});
    const [filters, setFilters] = useState({
        difficulty: "",
        subtype: "",
        tier: "",
    });
    const [userTier, setUserTier] = useState(false);

    console.log(solvedQuestions);

    // Extract unique subtypes from questions
    const subtypes = Array.from(new Set(questions.map((q) => q.subtype)));
    const difficulties = [1, 2, 3, 4, 5];
    const tiers = ["free", "paid"];

    function handleFilterChange(e) {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        setCurrentPage(1); // Reset to first page on filter change
    }

    // Fetch questions and solved questions
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/aptitude.json");
                const data = await res.json();

                const counts = {};
                Object.keys(data).forEach((type) => {
                    counts[type] = data[type].length;
                });

                setTypeCounts(counts);
                setQuestions(data["ques"] || []);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!user || !isLoaded) return;

        const fetchUserData = async () => {
            try {
                const userRef = doc(db, "users", user.id);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    const plan = docSnap.data().plan || "free";
                    if (plan === "paid") setUserTier(true);
                }

            const solvedRef = collection(
                db,
                `users/${user.id}/aptitude-questions`
            );
            const snap = await getDocs(solvedRef);
            const solved = {};
            snap.forEach((doc) => {
                solved[doc.id] = doc.data();
            });

            setSolvedQuestions(solved);

            const preAnswers = {};
            const preExplanations = {};
            Object.entries(solved).forEach(([qid, data]) => {
                preAnswers[qid] = data.selectedOption;
                preExplanations[qid] = true;
            });

                setAnswers(preAnswers);
                setShowExplanation(preExplanations);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user, isLoaded]);

    // Filtered questions
    const filteredQuestions = useMemo(() => {
        return questions.filter((q) => {
            return (
                (!filters.difficulty ||
                    q.difficulty === Number(filters.difficulty)) &&
                (!filters.subtype || q.subtype === filters.subtype) &&
                (!filters.tier || q.tier === filters.tier)
            );
        });
    }, [questions, filters]);

    const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);
    const startIdx = (currentPage - 1) * QUESTIONS_PER_PAGE;
    const currentQuestions = filteredQuestions.slice(
        startIdx,
        startIdx + QUESTIONS_PER_PAGE
    );

    const handleOptionChange = useCallback(
        async (qid, option) => {
        setAnswers((prev) => ({ ...prev, [qid]: option }));
        setShowExplanation((prev) => ({ ...prev, [qid]: true }));

            const q = questions.find((q) => q.id === qid);
        const isCorrect = option === q.ans;

        if (!user || solvedQuestions[qid]) return;

            const docRef = doc(
                db,
                `users/${user.id}/aptitude-questions/${qid}`
            );
            await setDoc(docRef, {
                questionId: qid,
                correct: isCorrect,
                selectedOption: option,
                answeredAt: serverTimestamp(),
            });

            if (isCorrect) {
            const userRef = doc(db, "users", user.id);
            await updateDoc(userRef, { points: increment(2) });
            }

            setSolvedQuestions((prev) => ({
                ...prev,
                [qid]: { correct: isCorrect, selectedOption: option },
            }));
        },
        [questions, solvedQuestions, user]
    );

    const toggleExplanation = (qid) => {
        setShowExplanation((prev) => ({ ...prev, [qid]: !prev[qid] }));
    };

    if (loading || !isLoaded) {
        return <Loader />;
    }
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
            className="flex flex-col min-h-screen bg-light-bg dark:bg-dark-surface text-light-primary-text dark:text-dark-primary-text gap-8 px-2 md:px-4">
            <motion.div
                variants={childVariants}
                className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-10 mb-2">
                <div className="md:ml-0 ml-12">
                    <h1 className="text-3xl font-bold">Question Bank</h1>
                    <p className="md:text-sm text-xs text-light-secondary-text dark:text-dark-secondary-text">
                        Build your problem-solving foundation and crack
                        placement aptitude with confidence.
                    </p>
                </div>
            </motion.div>

            <div className="flex flex-col gap-4">
                <motion.div
                    variants={childVariants}
                    className="flex justify-end">
                    <Popover className="relative">
                        {({ open, close }) => (
                            <>
                                <div className="flex items-center gap-2">
                                    {(filters.difficulty ||
                                        filters.subtype ||
                                        filters.tier) && (
                                        <button
                                            onClick={() => {
                                                setFilters({
                                                    difficulty: "",
                                                    subtype: "",
                                                    tier: "",
                                                });
                                                setCurrentPage(1);
                                            }}
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
                                                (filters.difficulty ||
                                                    filters.subtype ||
                                                    filters.tier) &&
                                                "ring-2 ring-light-primary dark:ring-dark-primary"
                                            }
                                        `}>
                                        <Filter className="h-4 w-4" />
                                        <span className="text-sm font-medium">
                                            {filters.difficulty ||
                                            filters.subtype ||
                                            filters.tier
                                                ? `Filters (${
                                                      [
                                                          filters.difficulty,
                                                          filters.subtype,
                                                          filters.tier,
                                                      ].filter(Boolean).length
                                                  })`
                                                : "Filters"}
                                        </span>
                                    </Popover.Button>
                                </div>
                                <Transition
                                    as={React.Fragment}
                                    enter="transition duration-200 ease-out"
                                    enterFrom="transform scale-95 opacity-0"
                                    enterTo="transform scale-100 opacity-100"
                                    leave="transition duration-150 ease-in"
                                    leaveFrom="transform scale-100 opacity-100"
                                    leaveTo="transform scale-95 opacity-0">
                                    <Popover.Panel className="absolute right-0 z-50 mt-2 w-80 origin-top-left">
                                        <div className="bg-white dark:bg-dark-bg rounded-xl shadow-lg ring-1 ring-black/5 p-6 space-y-4">
                                            {/* Difficulty Filter */}
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-light-secondary-text dark:text-dark-secondary-text">
                                                    Difficulty
                                                </label>
                                                <select
                                                    name="difficulty"
                                                    value={filters.difficulty}
                                                    onChange={
                                                        handleFilterChange
                                                    }
                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-light-surface dark:bg-dark-surface border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary">
                                                    <option value="">
                                                        All Difficulties
                                                    </option>
                                                    {difficulties.map((d) => (
                                                        <option
                                                            key={d}
                                                            value={d}>
                                                            Difficulty {d}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            {/* Subtype Filter */}
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-light-secondary-text dark:text-dark-secondary-text">
                                                    Subtype
                                                </label>
                                                <select
                                                    name="subtype"
                                                    value={filters.subtype}
                                                    onChange={
                                                        handleFilterChange
                                                    }
                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-light-surface dark:bg-dark-surface border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary">
                                                    <option value="">
                                                        All Subtypes
                                                    </option>
                                                    {subtypes.map((s) => (
                                                        <option
                                                            key={s}
                                                            value={s}>
                                                            {s}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            {/* Tier Filter */}
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-light-secondary-text dark:text-dark-secondary-text">
                                                    Tier
                                                </label>
                                                <select
                                                    name="tier"
                                                    value={filters.tier}
                                                    onChange={
                                                        handleFilterChange
                                                    }
                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-light-surface dark:bg-dark-surface border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary">
                                                    <option value="">
                                                        All Tiers
                                                    </option>
                                                    {tiers.map((t) => (
                                                        <option
                                                            key={t}
                                                            value={t}>
                                                            {t
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                t.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </Popover.Panel>
                                </Transition>
                            </>
                        )}
                    </Popover>
                </motion.div>
                <div className="flex flex-col gap-4">
                {currentQuestions.length === 0 ? (
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
                ) : (
                    currentQuestions.map((q, idx) => {
                        const answered = answers[q.id] !== undefined;
                            const isCorrect =
                                answered && answers[q.id] === q.ans;
                            const alreadySolved =
                                solvedQuestions[q.id]?.correct;
                            const userPlan = q.tier === "paid";
                        return (
                                <motion.div
                                key={q.id}
                                    variants={childVariants}
                                    className={`relative rounded-xl p-4 w-[100%] mx-auto md:p-6 shadow-sm transition-colors duration-200 ${getColorClass(
                                    isCorrect || alreadySolved,
                                    answered || alreadySolved
                                )} ${
                                        userPlan && !userTier
                                        ? "opacity-60 pointer-events-none"
                                        : ""
                                }`}>
                                {/* Premium overlay for paid questions */}
                                    {userPlan && !userTier && (
                                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-b from-yellow-100 to-yellow-300 dark:from-yellow-800 dark:to-yellow-600 rounded-xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Lock className="text-yellow-600 dark:text-yellow-200 h-6 w-6" />
                                            <span className="font-bold text-yellow-800 dark:text-yellow-100 text-lg">
                                                Premium
                                            </span>
                                        </div>
                                        <span className="text-xs text-yellow-900 dark:text-yellow-200">
                                            Unlock with Premium Access
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-semibold text-white bg-dark-primary p-2 rounded-md flex items-center gap-2">
                                            Q{q.id}
                                        </span>
                                        {/* Difficulty stars */}
                                        <span className="flex items-center gap-0.5 ml-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${
                                                        i < q.difficulty
                                                            ? "text-yellow-400 fill-yellow-400"
                                                            : "text-gray-300 dark:text-gray-600"
                                                    }`}
                                                    fill={
                                                        i < q.difficulty
                                                            ? "#facc15"
                                                            : "none"
                                                    }
                                                />
                                            ))}
                                        </span>
                                        {alreadySolved && (
                                            <Check className="inline-block text-light-success dark:text-dark-success h-6 w-6" />
                                        )}
                                    </div>
                                        <span className="text-[10px] md:text-xs font-semibold text-black/80 dark:text-white/80 bg-light-bg dark:bg-dark-surface p-2 rounded-md flex items-center gap-1">
                                        {q.type}
                                    </span>
                                </div>
                                    <div className="font-medium md:max-w-[80%] mb-3 md:text-lg text-sm">
                                    {q.ques}
                                </div>
                                <div className="flex flex-col gap-2 mb-2">
                                    {q.options.map((opt) => (
                                        <label
                                            key={opt}
                                            className={`flex items-center w-fit gap-2 px-3 py-2 rounded-lg cursor-pointer  transition-colors duration-150
                                            ${
                                                answered || alreadySolved
                                                    ? opt === q.ans
                                                        ? "border-light-success dark:border-dark-success bg-light-success/20 dark:bg-dark-success/20"
                                                        : opt === answers[q.id]
                                                        ? "border-light-fail dark:border-dark-fail bg-light-fail/20 dark:bg-dark-fail/20"
                                                        : "border-gray-200 dark:border-gray-700"
                                                    : "border-gray-200 dark:border-gray-700 hover:border-light-primary dark:hover:border-dark-primary"
                                            }
                                            ${
                                                userPlan && !userTier
                                                    ? "opacity-60 pointer-events-none"
                                                    : ""
                                            }
                                        `}>
                                            <input
                                                type="radio"
                                                name={`q-${q.id}`}
                                                value={opt}
                                                disabled={
                                                    answered ||
                                                    alreadySolved ||
                                                        (userPlan && !userTier)
                                                }
                                                checked={
                                                    alreadySolved
                                                        ? opt === q.ans
                                                            : answers[q.id] ===
                                                              opt
                                                }
                                                onChange={() =>
                                                    handleOptionChange(
                                                        q.id,
                                                        opt
                                                    )
                                                }
                                                className="accent-light-primary dark:accent-dark-primary"
                                            />
                                            <span className="text-sm md:text-base">
                                                {opt}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                    {(answered || alreadySolved) && (
                                    <div className="mt-2">
                                        <button
                                            className="text-xs underline text-light-primary dark:text-dark-primary focus:outline-none"
                                            onClick={() =>
                                                toggleExplanation(q.id)
                                            }>
                                            {showExplanation[q.id]
                                                ? "Hide Explanation"
                                                : "Show Explanation"}
                                        </button>
                                        {showExplanation[q.id] && (
                                            <div className="mt-2 p-3 rounded bg-light-surface dark:bg-dark-surface border border-gray-100 dark:border-gray-700 text-sm animate-fadeIn">
                                                <div className="mb-1 font-semibold">
                                                    {isCorrect ||
                                                    alreadySolved ? (
                                                        <span className="text-light-success dark:text-dark-success">
                                                            Correct!
                                                        </span>
                                                    ) : (
                                                        <span className="text-light-fail dark:text-dark-fail">
                                                            Incorrect.
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <b>Answer:</b> {q.ans}
                                                </div>
                                                <div className="mt-1">
                                                    <b>Explanation:</b>{" "}
                                                    {q.explanation}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                </motion.div>
                        );
                    })
                )}
                </div>
            </div>

            {/* Pagination Controls */}

            {currentQuestions.length > 0 && (
                <div className="flex justify-center items-center gap-4 mt-8 mb-8">
                    <button
                        className="px-3 py-1 rounded border bg-light-surface dark:bg-dark-surface text-light-primary-text dark:text-dark-primary-text border-gray-200 dark:border-gray-700 disabled:opacity-50"
                        onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span className="text-sm">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="px-3 py-1 rounded border bg-light-surface dark:bg-dark-surface text-light-primary-text dark:text-dark-primary-text border-gray-200 dark:border-gray-700 disabled:opacity-50"
                        onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default AptitudeAllQuestionHomepage;
