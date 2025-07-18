import React from "react";
import {
    Clock4,
    FileText,
    CheckCircle,
    Clock,
    ChevronRight,
} from "lucide-react";

/**
 * RecentInterviewsSection
 * - The heading, icon, and description are static.
 * - The recent interviews data is passed as a prop.
 * - The navigate and userId functions are passed as props for navigation.
 */
export default function RecentInterviewsSection({
    recentInterviews = [],
    userId,
    navigate,
}) {
    return (
        <div className="md:w-[49%] w-full bg-light-surface dark:bg-dark-bg rounded-xl md:p-6 p-4 flex flex-col shadow-md transition-transform duration-300 hover:scale-[1.005] hover:shadow-lg">
            <div className="flex items-center gap-4">
                <div className="bg-light-bg dark:bg-dark-surface p-3 rounded-full shadow-sm">
                    <Clock4 size={24} />
                </div>
                <div className="flex flex-col">
                    <p className="text-xl font-semibold">Recent Interviews</p>
                    <p className="text-light-secondary-text">
                        Your latest mock interview sessions
                    </p>
                </div>
            </div>
            <div>
                {recentInterviews.length > 0 ? (
                    <ul className="mt-4 space-y-4 ">
                        {recentInterviews.map((interview) => (
                            <li
                                key={interview.id}
                                className="flex items-center justify-between p-4 bg-light-bg dark:bg-dark-surface rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                                onClick={() =>
                                    interview.isCompleted
                                        ? navigate(
                                              `/${userId}/mock-interview/${interview.id}/analysis`
                                          )
                                        : navigate(
                                              `/${userId}/mock-interview/${interview.id}`
                                          )
                                }>
                                <div className="flex items-center gap-3">
                                    <FileText size={24} />
                                    <div>
                                        <p className="font-semibold md:text-base text-sm">
                                            {interview.interviewName ||
                                                "Mock Interview"}
                                        </p>
                                        <p className="md:text-sm text-xs text-gray-500 dark:text-gray-400">
                                            {interview.createdAt?.toDate
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
                                            <CheckCircle className="md:w-4 md:h-4 w-5 h-5" />
                                            <p className="md:block hidden">
                                                Completed
                                            </p>
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 text-xs font-semibold">
                                            <Clock className="md:w-4 md:h-4 w-5 h-5" />
                                            <p className="md:block hidden">
                                                Ongoing
                                            </p>
                                        </span>
                                    )}

                                    <span className="text-sm flex gap-1 font-medium text-blue-600 dark:text-blue-400">
                                        <p className="md:block hidden">Score: </p>
                                        {interview.analysis?.overallScore
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
    );
}
