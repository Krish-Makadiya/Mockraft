import React, { useEffect, useState, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import {
    Calculator,
    Clock,
    Ellipsis,
    Filter,
    ListFilter,
    Star,
    StarIcon,
    X,
    Minus,
    FilePlus2,
} from "lucide-react";
import Loader from "../../components/main/Loader";
import { Popover, Transition } from "@headlessui/react";
import aptitudeRaw from "../../../public/aptitude.json";
import { useTheme } from "../../context/ThemeProvider";
import { motion } from "framer-motion";

// Parse aptitude.json for majorType and subType
const aptitudeData = Array.isArray(aptitudeRaw.questions)
    ? aptitudeRaw.questions
    : Array.isArray(aptitudeRaw)
    ? aptitudeRaw
    : [];

// Get unique majorTypes
const majorTypes = Array.from(new Set(aptitudeData.map((q) => q.type)));

// Helper to get subTypes for a given majorType
function getSubTypes(majorType) {
    return Array.from(
        new Set(
            aptitudeData
                .filter((q) => q.type === majorType)
                .map((q) => q.subtype)
        )
    );
}

const statusOptions = [
    { value: "", label: "All Status" },
    { value: "completed", label: "Completed" },
    { value: "inprogress", label: "In Progress" },
];

const AptitudeTestCard = ({
    test,
    userId,
    onBookmarkToggle,
    expanded,
    setExpanded,
}) => {
    const [bookmarked, setBookmarked] = useState(test.bookmarked || false);
    const [showAllSubtopics, setShowAllSubtopics] = useState(false);
    const navigate = useNavigate();

    const handleBookmark = async (e) => {
        e.stopPropagation();
        const newValue = !bookmarked;
        setBookmarked(newValue);
        if (onBookmarkToggle) onBookmarkToggle(test.id, newValue);
        // Update Firestore
        const testRef = doc(db, `users/${userId}/aptitude-test/${test.id}`);
        await updateDoc(testRef, { bookmarked: newValue });
    };

    const cardClickHandler = () => {
        if (test.isCompleted) {
            navigate(`/${userId}/aptitude/${test.id}/analysis`);
        } else {
            navigate(`/${userId}/aptitude/${test.id}`);
        }
    };
    return (
        <div
            className="group w-full bg-white dark:bg-dark-bg rounded-lg shadow-sm border border-light-surface dark:border-dark-surface md:p-4 p-3 hover:shadow-md duration-200 transition-all hover:scale-[100.5%] cursor-pointer"
            onClick={cardClickHandler}>
            <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-light-primary/20 to-light-primary/10 dark:from-dark-primary/20 dark:to-dark-primary/10 p-3 rounded-lg">
                    <Calculator className="w-5 h-5 text-light-primary dark:text-dark-primary" />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between">
                        <div>
                            <div className="flex items-center justify-between gap-2">
                                <h3 className="font-medium text-light-primary-text dark:text-dark-primary-text truncate text-lg md:text-xl">
                                    {test.config?.testName || "Untitled Test"}
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2 mb-1">
                                {(test.config?.majorType || []).map((type) => (
                                    <span
                                        key={type}
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-light-primary/20 to-light-secondary/20 dark:from-dark-primary/30 dark:to-dark-secondary/30 text-light-primary dark:text-dark-primary">
                                        {type}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {test.point && (
                            <div className="text-xs font-semibold text-black mt-1 bg-yellow-400 h-fit px-2 py-1 rounded-2xl">
                                Points: +{test.point}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-1 my-3 items-center">
                        {(() => {
                            const subs = test.config?.subtopic || [];
                            if (subs.length > 6 && !expanded) {
                                return (
                                    <>
                                        {subs.slice(0, 6).map((sub) => (
                                            <span
                                                key={sub}
                                                className="inline-flex items-center px-2 py-0.5 rounded text-xs text-light-secondary dark:text-dark-secondary">
                                                {sub}
                                            </span>
                                        ))}
                                        <button
                                            className="ml-2 px-2 py-1  rounded text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setExpanded();
                                            }}>
                                            +{subs.length - 6}
                                        </button>
                                    </>
                                );
                            } else if (subs.length > 6 && expanded) {
                                return (
                                    <>
                                        {subs.map((sub) => (
                                            <span
                                                key={sub}
                                                className="inline-flex items-center px-2 py-0.5 rounded text-xs text-light-secondary dark:text-dark-secondary">
                                                {sub}
                                            </span>
                                        ))}
                                        <button
                                            className="ml-2 px-2 py-1 rounded text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setExpanded();
                                            }}
                                            title="Collapse">
                                            <Minus className="w-4 h-4" />
                                        </button>
                                    </>
                                );
                            } else {
                                return subs.map((sub) => (
                                    <span
                                        key={sub}
                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs text-light-secondary dark:text-dark-secondary">
                                        {sub}
                                    </span>
                                ));
                            }
                        })()}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap gap-2">
                                <div className="inline-flex items-center text-xs bg-gradient-to-r from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 px-2 py-1 rounded-md">
                                    <Calculator className="w-3 h-3 mr-1 text-light-primary dark:text-dark-primary" />
                                    {test.questions?.length || 0} Questions
                                </div>
                            </div>
                            <div className="flex items-center gap-3 justify-between">
                                <div className="flex gap-2">
                                    <div className="flex items-center text-xs text-light-secondary-text/70 dark:text-dark-secondary-text/70">
                                        <Clock className="w-3 h-3 mr-1" />
                                        Created{" "}
                                        {test.createdAt
                                            ? test.createdAt.seconds
                                                ? new Date(
                                                      test.createdAt.seconds *
                                                          1000
                                                  ).toLocaleDateString(
                                                      "en-US",
                                                      {
                                                          year: "numeric",
                                                          month: "short",
                                                          day: "numeric",
                                                      }
                                                  )
                                                : new Date(
                                                      test.createdAt
                                                  ).toLocaleDateString(
                                                      "en-US",
                                                      {
                                                          year: "numeric",
                                                          month: "short",
                                                          day: "numeric",
                                                      }
                                                  )
                                            : "recently"}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div
                                            className={`h-2 w-2 rounded-full ${
                                                test.isCompleted
                                                    ? "bg-gradient-to-r from-green-400 to-green-500"
                                                    : "bg-gradient-to-r from-yellow-400 to-yellow-500"
                                            }`}
                                        />
                                        <span className="text-xs text-light-secondary-text dark:text-dark-secondary-text">
                                            {test.isCompleted
                                                ? "Completed"
                                                : "In Progress"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleBookmark}
                            className="md:px-2 px-1"
                            title={bookmarked ? "Remove Bookmark" : "Bookmark"}>
                            <Star
                                size={26}
                                className={`cursor-pointer transition-all duration-200 group-hover:opacity-100 group-hover:scale-105 text-yellow-400 ${
                                    bookmarked ? "fill-yellow-400" : ""
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AptitudeTestHomepage = ({ isCreateModalOpen, setIsCreateModalOpen }) => {
    const { user } = useUser();
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        majorType: "",
        subType: "",
        status: "",
    });
    const [showStarredOnly, setShowStarredOnly] = useState(false);
    const [expandedSubtopicsTestId, setExpandedSubtopicsTestId] =
        useState(null);

    const { theme } = useTheme();

    useEffect(() => {
        const fetchTests = async () => {
            if (!user?.id) return;
            setLoading(true);
            const colRef = collection(db, `users/${user.id}/aptitude-test`);
            const snap = await getDocs(colRef);
            let data = snap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            // Sort by createdAt descending (newest first)
            data = data.sort((a, b) => {
                const aTime = a.createdAt?.seconds
                    ? a.createdAt.seconds
                    : Date.parse(a.createdAt) / 1000;
                const bTime = b.createdAt?.seconds
                    ? b.createdAt.seconds
                    : Date.parse(b.createdAt) / 1000;
                return bTime - aTime;
            });
            setTests(data);
            setLoading(false);
        };
        fetchTests();
    }, [user]);

    // Filtered tests
    const filteredTests = useMemo(() => {
        return tests.filter((test) => {
            let match = true;
            if (
                filters.majorType &&
                !test.config?.majorType?.includes(filters.majorType)
            )
                match = false;
            if (
                filters.subType &&
                !test.config?.subtopic?.includes(filters.subType)
            )
                match = false;
            if (filters.status === "completed" && !test.isCompleted)
                match = false;
            if (filters.status === "inprogress" && test.isCompleted)
                match = false;
            if (showStarredOnly && !test.bookmarked) match = false;
            return match;
        });
    }, [
        tests,
        filters.majorType,
        filters.subType,
        filters.status,
        showStarredOnly,
    ]);

    function handleFilterChange(e) {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "majorType" ? { subType: "" } : {}),
        }));
    }

    if (loading) {
        return <Loader />;
    }

    const subTypes = filters.majorType ? getSubTypes(filters.majorType) : [];

    const handleBookmarkToggle = (testId, value) => {
        setTests((prev) =>
            prev.map((t) => (t.id === testId ? { ...t, bookmarked: value } : t))
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
            className="flex flex-col min-h-screen bg-light-bg dark:bg-dark-surface text-light-primary-text dark:text-dark-primary-text gap-8 px-2 md:px-4">
            <motion.div
                variants={childVariants}
                className="flex justify-between items-center gap-10">
                <div className="md:ml-0 ml-12">
                    <h1 className="text-3xl font-bold">Aptitude</h1>
                    <p className="md:text-sm text-xs text-light-secondary-text dark:text-dark-secondary-text">
                        Build your problem-solving foundation and crack
                        placement aptitude with confidence.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary md:px-4 md:py-3 px-2 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Create new mock interview">
                    <FilePlus2
                        className="relative md:h-6 h-12 md:w-6 w-12 text-white transition-transform duration-200 
                                                ease-out group-hover:scale-[1.02]"
                    />

                    <span className="relative hidden font-medium text-white sm:inline-block">
                        New Aptitude
                    </span>
                </button>
            </motion.div>
            <div className="flex flex-col gap-4">
                {/* Filter Section */}
                <motion.div variants={childVariants}>
                    <Popover className="relative">
                        {({ open, close }) => (
                            <>
                                <div className="flex justify-end items-center gap-2">
                                    {(filters.majorType ||
                                        filters.subType ||
                                        filters.status) && (
                                        <button
                                            onClick={() => {
                                                setFilters({
                                                    majorType: "",
                                                    subType: "",
                                                    status: "",
                                                });
                                                setShowStarredOnly(false);
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
                      (filters.majorType ||
                          filters.subType ||
                          filters.status) &&
                      "ring-2 ring-light-primary dark:ring-dark-primary"
                  }
                `}>
                                        <Filter className="h-4 w-4" />
                                        <span className="text-sm font-medium">
                                            {filters.majorType ||
                                            filters.subType ||
                                            filters.status
                                                ? `Filters (${
                                                      [
                                                          filters.majorType,
                                                          filters.subType,
                                                          filters.status,
                                                      ].filter(Boolean).length
                                                  })`
                                                : "Filters"}
                                        </span>
                                    </Popover.Button>
                                    <Star
                                        onClick={() =>
                                            setShowStarredOnly((prev) => !prev)
                                        }
                                        className={`cursor-pointer transition-all ml-2 text-yellow-400 ${
                                            showStarredOnly
                                                ? "fill-yellow-400"
                                                : "text-yellow-400"
                                        }`}
                                    />
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
                                            {/* Major Type Filter */}
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-light-secondary-text dark:text-dark-secondary-text">
                                                    Major Type
                                                </label>
                                                <select
                                                    name="majorType"
                                                    value={filters.majorType}
                                                    onChange={
                                                        handleFilterChange
                                                    }
                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-light-surface dark:bg-dark-surface border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary">
                                                    <option value="">
                                                        All Major Types
                                                    </option>
                                                    {majorTypes.map((m) => (
                                                        <option
                                                            key={m}
                                                            value={m}>
                                                            {m}
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
                                                    name="subType"
                                                    value={filters.subType}
                                                    onChange={
                                                        handleFilterChange
                                                    }
                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-light-surface dark:bg-dark-surface border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary disabled:cursor-not-allowed"
                                                    disabled={
                                                        !filters.majorType
                                                    }>
                                                    <option value="">
                                                        All Subtypes
                                                    </option>
                                                    {subTypes.map((s) => (
                                                        <option
                                                            key={s}
                                                            value={s}>
                                                            {s}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            {/* Status Filter */}
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-light-secondary-text dark:text-dark-secondary-text">
                                                    Status
                                                </label>
                                                <select
                                                    name="status"
                                                    value={filters.status}
                                                    onChange={
                                                        handleFilterChange
                                                    }
                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-light-surface dark:bg-dark-surface border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary">
                                                    {statusOptions.map(
                                                        (opt) => (
                                                            <option
                                                                key={opt.value}
                                                                value={
                                                                    opt.value
                                                                }>
                                                                {opt.label}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                    </Popover.Panel>
                                </Transition>
                            </>
                        )}
                    </Popover>
                </motion.div>
                <motion.div
                    variants={childVariants}
                    className="flex flex-col gap-3">
                    {filteredTests.length === 0 ? (
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
                    ) : (
                        filteredTests.map((test) => (
                            <AptitudeTestCard
                                key={test.id}
                                test={test}
                                userId={user?.id}
                                onBookmarkToggle={handleBookmarkToggle}
                                expanded={expandedSubtopicsTestId === test.id}
                                setExpanded={() =>
                                    setExpandedSubtopicsTestId(
                                        expandedSubtopicsTestId === test.id
                                            ? null
                                            : test.id
                                    )
                                }
                            />
                        ))
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AptitudeTestHomepage;
