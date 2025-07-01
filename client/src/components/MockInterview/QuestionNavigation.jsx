import React from "react";
import { ChevronRight } from "lucide-react";

/**
 * QuestionNavigation
 * - All button labels and layout are static.
 * - Receives currentIndex, totalQuestions, onPrev, onNext, onSubmit as props.
 */
export default function QuestionNavigation({
    currentIndex,
    totalQuestions,
    onPrev,
    onNext,
    onSubmit,
}) {
    return (
        <div className="flex justify-between mt-8 pt-4 border-t border-neitral-500 dark:border-neutral-600">
            <button
                onClick={onPrev}
                disabled={currentIndex === 0}
                className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                    currentIndex === 0
                        ? "text-light-secondary-text dark:text-dark-secondary-text cursor-not-allowed"
                        : "text-light-secondary-text dark:text-dark-secondary-text hover:bg-light-primary dark:hover:bg-dark-primary  hover:text-dark-primary-text"
                }`}>
                <ChevronRight className="w-4 h-4 transform rotate-180" />
                Previous
            </button>

            {currentIndex === totalQuestions - 1 ? (
                <button
                    onClick={onSubmit}
                    className="px-4 py-2 rounded-md flex items-center gap-2 text-light-secondary-text dark:text-dark-secondary-text hover:bg-light-primary dark:hover:bg-dark-primary  hover:text-dark-primary-text">
                    Submit
                    <ChevronRight className="w-4 h-4" />
                </button>
            ) : (
                <button
                    onClick={onNext}
                    disabled={currentIndex === totalQuestions - 1}
                    className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                        currentIndex === totalQuestions - 1
                            ? "text-light-secondary-text dark:text-dark-secondary-text cursor-not-allowed"
                            : "text-light-secondary-text dark:text-dark-secondary-text hover:bg-light-primary dark:hover:bg-dark-primary  hover:text-dark-primary-text"
                    }`}>
                    Next
                    <ChevronRight className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}