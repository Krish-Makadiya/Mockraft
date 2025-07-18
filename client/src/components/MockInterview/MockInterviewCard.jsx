import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { Briefcase, Code, Layers, Clock, Star } from "lucide-react";
import { db } from "../../config/firebase";
import toast from "react-hot-toast";

const MockInterviewCard = ({ interview, onBookmarkToggle }) => {
    const { user } = useUser();
    const [isBookmarked, setIsBookmarked] = useState(interview.isBookmarked);
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate();

    const bookmarkHandler = async (e) => {
        e.stopPropagation();
        if (isUpdating) return;
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
            if (onBookmarkToggle) onBookmarkToggle(interview.id, !isBookmarked);
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
        if (interview.isCompleted) {
            navigate(`/${user.id}/mock-interview/${interview.id}/analysis`);
        } else {
            navigate(`/${user.id}/mock-interview/${interview.id}`);
        }
    };

    return (
        <div
            onClick={interviewCardHandler}
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
                                <div className="flex items-center md:text-xs text-[10px] text-light-secondary-text/70 dark:text-dark-secondary-text/70">
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
                                    transition-all duration-200 group-hover:opacity-100 group-hover:scale-105 ${
                                        isUpdating
                                            ? "opacity-50"
                                            : "hover:scale-110"
                                    } ${
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

export default MockInterviewCard;
