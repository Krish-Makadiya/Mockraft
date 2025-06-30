import React from "react";
import { MailCheck, Crown, Gift, TrophyIcon, WalletMinimal } from "lucide-react";

export default function UserProfileCard({ userData }) {
    return (
        <div className="flex md:flex-row flex-col items-center md:gap-8 gap-3 bg-light-surface dark:bg-dark-bg p-6 rounded-xl shadow-md transition-transform duration-300 hover:scale-[1.005] hover:shadow-lg w-full mx-auto">
            <img
                src={userData?.avtaar || "/default-avatar.png"}
                alt="User Avatar"
                className="w-32 h-32 rounded-full object-cover border-3 border-blue-200 dark:border-blue-500 shadow"
            />
            <div className="flex-1 flex md:flex-row flex-col gap-4 justify-between">
                <div className="flex flex-col md:items-start items-center md:gap-3 gap-2">
                    <div className="flex flex-col gap-1 md:items-start items-center">
                        <div className="text-2xl font-bold text-light-primary-text dark:text-dark-primary-text">
                            {userData?.fullname || "No Name"}
                        </div>
                        <div className="text-base flex items-center md:gap-2 gap-1 text-gray-500 dark:text-gray-500">
                            <MailCheck className="md:w-6 md:h-6 w-4 h-4" />
                            {userData?.email || "No Email"}
                        </div>
                    </div>
                    <span
                        className={`inline-flex w-fit items-center gap-2 px-4 py-2 rounded-full font-semibold shadow-sm
                            ${
                                userData?.plan === "premium"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
                            }
                        `}
                    >
                        {userData?.plan === "premium" ? (
                            <>
                                <Crown className="w-6 h-6 text-yellow-500" />
                                Premium
                            </>
                        ) : (
                            <>
                                <Gift className="w-6 h-6 text-blue-400" />
                                Free
                            </>
                        )}
                    </span>
                </div>
                <div className="flex flex-col justify-between items-end">
                    <div className="flex gap-3 w-full justify-center">
                        <div className="flex items-center">
                            <span className="inline-flex items-center p-3 rounded-full gap-2 bg-yellow-50 dark:bg-yellow-900/30 shadow-sm">
                                <TrophyIcon className="w-6 h-6 text-yellow-500" />
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {" "}
                                    {userData?.points ?? 0} Points
                                </p>
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center p-3 rounded-full gap-2 bg-blue-50 dark:bg-blue-900/30 shadow-sm">
                                <WalletMinimal className="w-6 h-6 text-blue-500" />
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {" "}
                                    {userData?.coins ?? 0} Coins
                                </p>
                            </span>
                        </div>
                    </div>
                    <div className="text-sm text-gray-400 dark:text-gray-500 md:text-end text-center w-full mt-4">
                        Joined:{" "}
                        {userData?.createdAt?.toDate
                            ? userData.createdAt
                                  .toDate()
                                  .toLocaleDateString("en-US", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                  })
                            : "Unknown"}
                    </div>
                </div>
            </div>
        </div>
    );
}