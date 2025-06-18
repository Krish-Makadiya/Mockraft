import { useUser } from "@clerk/clerk-react";
import { Briefcase, Calendar, Code, Gauge, Layers, Star, User, X } from "lucide-react";
import { useState } from "react";

const Drawer = ({ interviewDetails, isInfoOpen, setIsInfoOpen }) => {
    const [isBookmarked, setIsBookmarked] = useState(
        interviewDetails.isBookmarked
    );
    const [isUpdating, setIsUpdating] = useState(false);
    const { user } = useUser();

    const bookmarkHandler = async () => {
        if (isUpdating) return;

        try {
            setIsUpdating(true);
            const interviewRef = doc(
                db,
                `users/${user.id}/mock-interviews`,
                interviewDetails.id
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

    return (
        <div
            className={`fixed inset-0 overflow-hidden z-10 ${
                !isInfoOpen && "pointer-events-none"
            }`}>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-light-secondary-text/90 dark:bg-gray-500/90 transition-opacity duration-300 ${
                    isInfoOpen ? "opacity-100" : "opacity-0"
                }`}
                onClick={() => setIsInfoOpen(false)}
            />

            {/* Drawer panel */}
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                <div
                    className={`w-screen max-w-md transform transition-transform duration-300 ease-in-out ${
                        isInfoOpen ? "translate-x-0" : "translate-x-full"
                    }`}>
                    {/* Close button */}
                    <div
                        className={`absolute top-0 left-0 -ml-8 pt-4 pr-2 sm:-ml-10 sm:pr-4 ${
                            !isInfoOpen && "hidden"
                        }`}>
                        <button
                            type="button"
                            onClick={() => setIsInfoOpen(false)}
                            className="relative rounded-md text-light-fail hover:text-light-fail-hover dark:text-dark-fail dark:hover:text-dark-fail-hover focus:outline-none">
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <X className="h-8 w-8" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Content */}
                    <div 
                        className="flex h-full flex-col overflow-y-auto bg-light-bg dark:bg-dark-bg shadow-xl custom-scrollbar"
                        style={{
                            '--scrollbar-thumb': 'var(--light-surface)',
                            '--scrollbar-thumb-hover': 'var(--light-primary)',
                            '@media (prefersColorScheme: dark)': {
                                '--scrollbar-thumb': 'var(--dark-surface)',
                                '--scrollbar-thumb-hover': 'var(--dark-primary)',
                            },
                        }}>
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-light-primary-text dark:text-dark-primary-text pr-8">
                                    {interviewDetails.interviewName}
                                </h2>

                                <Star
                                    onClick={bookmarkHandler}
                                    size={25}
                                    className={`text-yellow-500 dark:text-yellow-400 cursor-pointer transition-all duration-200 ${
                                        isUpdating
                                            ? "opacity-50"
                                            : "hover:scale-110"
                                    } ${
                                        isBookmarked &&
                                        "fill-yellow-500 dark:fill-yellow-400 opacity-100"
                                    }`}
                                />
                            </div>

                            <div className="mt-8 space-y-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-light-primary-text dark:text-dark-primary-text flex items-center">
                                        <Briefcase className="h-5 w-5 mr-2 text-light-primary dark:text-dark-primary" />
                                        Position Details
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <p className="text-sm font-medium text-light-secondary-text dark:text-dark-primary-text/80">
                                                Experience Level
                                            </p>
                                            <p className="mt-1 text-sm  capitalize">
                                                {interviewDetails.experienceLevel.toLowerCase()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-light-secondary-text dark:text-dark-primary-text/80">
                                                Primary Language
                                            </p>
                                            <p className="mt-1 text-sm  capitalize">
                                                {
                                                    interviewDetails.programmingLanguage
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-light-secondary-text dark:text-dark-primary-text/80">
                                                Technology Stack
                                            </p>
                                            <p className="mt-1 text-sm capitalize">
                                                {
                                                    interviewDetails.technologyStack
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-light-secondary-text dark:text-dark-primary-text/80">
                                                Created On
                                            </p>
                                            <p className="mt-1 text-sm">
                                                {interviewDetails.createdAt
                                                    ?.seconds
                                                    ? new Date(
                                                          interviewDetails
                                                              .createdAt
                                                              .seconds * 1000
                                                      ).toLocaleDateString(
                                                          "en-US",
                                                          {
                                                              year: "numeric",
                                                              month: "short",
                                                              day: "numeric",
                                                          }
                                                      )
                                                    : "recently"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-light-surface dark:border-dark-surface my-6" />

                                {/* Job Description */}
                                <div>
                                    <h3 className="text-lg font-medium text-light-primary-text dark:text-dark-primary-text flex items-center">
                                        <Gauge className="h-5 w-5 mr-2 text-green-500" />
                                        Job Description
                                    </h3>
                                    <p className="mt-2 text-sm text-light-secondary-text dark:text-dark-secondary-text/80  whitespace-pre-line">
                                        {interviewDetails.jobDescription}
                                    </p>
                                </div>

                                <div className="border-t border-light-surface dark:border-dark-surface my-6" />

                                {/* Notifications */}
                                <div>
                                    <h3 className="text-lg font-medium text-light-primary-text dark:text-dark-primary-text flex items-center">
                                        <Layers className="h-5 w-5 mr-2 text-purple-500" />
                                        Notification Settings
                                    </h3>
                                    <div className="mt-4 space-y-3">
                                        <NotificationItem
                                            icon={<User className="h-4 w-4" />}
                                            label="Candidates"
                                            enabled={
                                                interviewDetails.notifications
                                                    ?.candidates
                                            }
                                        />
                                        <NotificationItem
                                            icon={<Code className="h-4 w-4" />}
                                            label="Comments"
                                            enabled={
                                                interviewDetails.notifications
                                                    ?.comments
                                            }
                                        />
                                        <NotificationItem
                                            icon={
                                                <Calendar className="h-4 w-4" />
                                            }
                                            label="Offers"
                                            enabled={
                                                interviewDetails.notifications
                                                    ?.offers
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NotificationItem = ({ icon, label, enabled }) => (
    <div className="flex items-center">
        <span
            className={`h-4 w-4 mr-2 ${
                enabled
                    ? "text-light-success dark:text-dark-success"
                    : "text-light-secondary-text dark:text-dark-secondary-text"
            }`}>
            {icon}
        </span>
        <span className="text-sm font-medium text-light-primary-text dark:text-dark-primary-text/80">
            {label}
        </span>
        <span className="ml-auto text-sm text-light-secondary-text dark:text-dark-secondary-text/80">
            {enabled ? "Enabled" : "Disabled"}
        </span>
    </div>
);

export default Drawer;
