import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { Calculator, Clock, Star } from "lucide-react";

const AptitudeTestCard = ({ test }) => {
    const [bookmarked, setBookmarked] = useState(false);
    // Status: for now, always 'Ready'. You can add logic for 'Completed' if needed.
    return (
        <div className="group w-full bg-white dark:bg-dark-bg rounded-lg shadow-sm border border-light-surface dark:border-dark-surface md:p-4 p-3 hover:shadow-md duration-200 transition-all hover:scale-[100.5%] cursor-pointer">
            <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-light-primary/20 to-light-primary/10 dark:from-dark-primary/20 dark:to-dark-primary/10 p-3 rounded-lg">
                    <Calculator className="w-5 h-5 text-light-primary dark:text-dark-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium text-light-primary-text dark:text-dark-primary-text truncate text-lg md:text-xl">
                            {test.config?.testName || "Untitled Test"}
                        </h3>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setBookmarked((b) => !b);
                            }}
                            className="md:px-2 px-1"
                            title={bookmarked ? "Remove Bookmark" : "Bookmark"}>
                            <Star
                                size={22}
                                className={`text-yellow-500 dark:text-yellow-400 cursor-pointer transition-all duration-200 group-hover:opacity-100 group-hover:scale-105 ${
                                    bookmarked
                                        ? "fill-yellow-500 dark:fill-yellow-400 opacity-100"
                                        : "hover:scale-110"
                                }`}
                            />
                        </button>
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
                    <div className="flex flex-wrap gap-1 mb-2">
                        {(test.config?.subtopic || []).map((sub) => (
                            <span
                                key={sub}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs text-light-secondary dark:text-dark-secondary">
                                {sub}
                            </span>
                        ))}
                    </div>
                    <div className="flex justify-between items-center mt-3">
                        <div className="flex flex-col gap-1">
                            <div className="flex flex-wrap gap-2">
                                <div className="inline-flex items-center text-xs bg-gradient-to-r from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 px-2 py-1 rounded-md">
                                    <Calculator className="w-3 h-3 mr-1 text-light-primary dark:text-dark-primary" />
                                    {test.questions?.length || 0} Questions
                                </div>
                            </div>
                            <div className="flex items-center mt-2 gap-3">
                                <div className="flex items-center mt-3 gap-3">
                                    <div className="flex items-center text-xs text-light-secondary-text/70 dark:text-dark-secondary-text/70">
                                        <Clock className="w-3 h-3 mr-1" />
                                        Created{" "}
                                        {test.createdAt?.seconds
                                            ? new Date(
                                                  test.createdAt.seconds * 1000
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
                        <div className="md:px-5 px-3 flex items-center">
                            <button
                                className="px-4 py-2 rounded-lg bg-light-secondary dark:bg-dark-secondary text-white text-sm font-semibold shadow hover:bg-light-secondary-hover dark:hover:bg-dark-secondary-hover transition-all"
                                onClick={(e) => {
                                    e.stopPropagation(); /* Add navigation logic here if needed */
                                }}>
                                View Details
                            </button>
                        </div>
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

    useEffect(() => {
        const fetchTests = async () => {
            if (!user?.id) return;
            setLoading(true);
            const colRef = collection(db, `users/${user.id}/aptitude-test`);
            const snap = await getDocs(colRef);
            const data = snap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTests(data);
            setLoading(false);
        };
        fetchTests();
    }, [user]);

    return (
        <div className="flex flex-col min-h-screen bg-light-bg dark:bg-dark-surface text-light-primary-text dark:text-dark-primary-text gap-8 px-2 md:px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-10 mb-2">
                <div className="md:ml-0 ml-2">
                    <h1 className="text-3xl font-bold">Aptitude</h1>
                    <p className="md:text-sm text-xs text-light-secondary-text dark:text-dark-secondary-text">
                        Build your problem-solving foundation and crack
                        placement aptitude with confidence.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="rounded-lg bg-gradient-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary px-4 py-2 text-white font-medium shadow hover:scale-[1.02] hover:shadow-lg transition-all duration-200">
                        New Aptitude
                    </button>
                </div>
            </div>
            <div>
                {loading ? (
                    <div className="text-center py-8 text-gray-400">
                        Loading...
                    </div>
                ) : tests.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        No aptitude tests found.
                    </div>
                ) : (
                    tests.map((test) => (
                        <AptitudeTestCard key={test.id} test={test} />
                    ))
                )}
            </div>
        </div>
    );
};

export default AptitudeTestHomepage;
