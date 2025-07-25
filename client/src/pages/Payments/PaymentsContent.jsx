import { useUser } from "@clerk/clerk-react";
import { doc, getDoc } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import toast from "react-hot-toast";
import Loader from "../../components/main/Loader";
import {
    BadgeCheck,
    CalendarDays,
    Clock,
    Hash,
    IndianRupee,
    Info,
    XCircle,
} from "lucide-react";

const PaymentsContent = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user } = useUser();

    useEffect(() => {
        const fetchPayments = async () => {
            const userSnap = await getDoc(doc(db, "users", user.id));
            if (userSnap.exists()) {
                const userData = userSnap.data();
                console.log("User Data:", userData);
                // Sort payments by createdAt descending (latest first)
                const sortedPayments = (userData.payments || []).sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setPayments(sortedPayments);
                setLoading(false);
            } else {
                toast.error("No user data found");
                setLoading(false);
            }
        };
        fetchPayments();
    }, [user]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            <div className="md:ml-0 ml-12">
                <h1 className="text-3xl font-bold">Payments</h1>
                <p className="md:text-sm text-xs text-light-secondary-text dark:text-dark-secondary-text">
                    View and manage your payment history here.
                </p>
            </div>
            <div className="overflow-x-auto mt-8 rounded-lg shadow hidden sm:block">
                <table className="min-w-full bg-white dark:bg-dark-bg rounded-lg">
                    <thead>
                        <tr>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-light-secondary-text dark:text-dark-secondary-text uppercase tracking-wider">
                                #
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-light-secondary-text dark:text-dark-secondary-text uppercase tracking-wider">
                                <Info className="inline w-4 h-4 mr-1 mb-0.5" />{" "}
                                Order ID
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-light-secondary-text dark:text-dark-secondary-text uppercase tracking-wider">
                                <CalendarDays className="inline w-4 h-4 mr-1 mb-0.5" />{" "}
                                Date
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-light-secondary-text dark:text-dark-secondary-text uppercase tracking-wider">
                                <IndianRupee className="inline w-4 h-4 mr-1 mb-0.5" />{" "}
                                Amount
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-light-secondary-text dark:text-dark-secondary-text uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length > 0 ? (
                            payments.map((payment, idx) => (
                                <tr
                                    key={payment.orderId}
                                    className="border-b border-light-surface dark:border-dark-surface hover:bg-light-surface/50 dark:hover:bg-dark-surface/50 transition">
                                    <td className="px-4 py-2 text-sm text-center text-light-primary-text dark:text-dark-primary-text font-semibold">
                                        <p className="bg-light-bg dark:bg-dark-surface py-4 rounded-2xl">
                                            {idx + 1}
                                        </p>
                                    </td>
                                    <td className="px-6 py-2 font-mono text-center text-sm text-light-primary-text dark:text-dark-primary-text">
                                        {payment.orderId}
                                    </td>
                                    <td className="px-6 py-2 text-sm text-center text-light-primary-text dark:text-dark-primary-text">
                                        {new Date(
                                            payment.createdAt
                                        ).toLocaleString("en-IN", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </td>
                                    <td className="px-6 py-2 text-base text-center font-bold text-light-primary dark:text-dark-primary">
                                        <IndianRupee className="inline w-4 h-4 mb-0.5 mr-1" />
                                        {(payment.amount / 100).toLocaleString(
                                            "en-IN"
                                        )}
                                    </td>
                                    <td className="px-6 py-2 text-center">
                                        <span
                                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold
                  ${
                      payment.status === "success"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : payment.status === "failed"
                          ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                  }
                `}>
                                            {payment.status === "success" && (
                                                <BadgeCheck className="w-4 h-4 mr-1" />
                                            )}
                                            {payment.status === "failed" && (
                                                <XCircle className="w-4 h-4 mr-1" />
                                            )}
                                            {payment.status !== "success" &&
                                                payment.status !== "failed" && (
                                                    <Clock className="w-4 h-4 mr-1" />
                                                )}
                                            {payment.status
                                                .charAt(0)
                                                .toUpperCase() +
                                                payment.status.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="text-center py-8 text-light-secondary-text dark:text-dark-secondary-text">
                                    No payment history available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden flex flex-col gap-2 mt-8">
                {payments.length > 0 ? (
                    payments.map((payment, idx) => (
                        <div
                            key={payment.orderId}
                            className="rounded-xl shadow bg-white dark:bg-dark-bg p-4 flex flex-col gap-2 border border-light-surface dark:border-dark-surface">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-light-secondary-text dark:text-dark-secondary-text flex items-center gap-1 bg-dark-surface p-2 rounded-md">
                                    #{idx + 1}
                                </span>
                                <span
                                    className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs font-bold
              ${
                  payment.status === "success"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : payment.status === "failed"
                      ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
              }
            `}>
                                    {payment.status === "success" && (
                                        <BadgeCheck className="w-4 h-4" />
                                    )}
                                    {payment.status === "failed" && (
                                        <XCircle className="w-4 h-4" />
                                    )}
                                    {payment.status !== "success" &&
                                        payment.status !== "failed" && (
                                            <Clock className="w-4 h-4" />
                                        )}
                                    {payment.status.charAt(0).toUpperCase() +
                                        payment.status.slice(1)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <Info className="w-4 h-4 text-light-secondary-text dark:text-dark-secondary-text" />
                                <span className="font-mono text-xs text-light-primary-text dark:text-dark-primary-text break-all">
                                    {payment.orderId}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CalendarDays className="w-4 h-4 text-light-secondary-text dark:text-dark-secondary-text" />
                                <span className="text-xs text-light-primary-text dark:text-dark-primary-text">
                                    {new Date(payment.createdAt).toLocaleString(
                                        "en-IN",
                                        {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        }
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <IndianRupee className="w-4 h-4 text-light-secondary-text dark:text-dark-secondary-text" />
                                <span className="text-base font-bold text-light-primary dark:text-dark-primary">
                                    {(payment.amount / 100).toLocaleString(
                                        "en-IN"
                                    )}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-light-secondary-text dark:text-dark-secondary-text">
                        No payment history available.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentsContent;
