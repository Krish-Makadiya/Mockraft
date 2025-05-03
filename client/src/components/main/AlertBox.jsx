import { useState } from "react";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from "@headlessui/react";
import { TriangleAlert, Info, CheckCircle2 } from "lucide-react";

export default function AlertBox({
    isOpen = false,
    onClose = () => {},
    title = "Alert",
    message = "This is an alert message",
    type = "warning",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm = () => {},
    showCancel = true,
}) {
    const iconMap = {
        warning: {
            icon: TriangleAlert,
            iconColor: "text-white",
            bgColor: "bg-light-fail dark:bg-dark-fail",
            buttonColor:
                "bg-light-fail dark:bg-dark-fail hover:bg-light-fail-hover dark:hover:bg-dark-fail-hover",
        },
        info: {
            icon: Info,
            iconColor: "text-white",
            bgColor: "bg-light-secondary dark:bg-dark-secondary",
            buttonColor:
                "bg-light-secondary dark:bg-dark-secondary hover:bg-light-secondary-hover dark:hover:bg-dark-secondary-hover",
        },
        success: {
            icon: CheckCircle2,
            iconColor: "text-white",
            bgColor: "bg-light-success dark:bg-dark-success",
            buttonColor: "bg-light-success dark:bg-dark-success hover:bg-light-success-hover dark:hover:bg-dark-success-hover",
        },
    };

    const { icon: Icon, iconColor, bgColor, buttonColor } = iconMap[type];

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-light-surface/70 dark:bg-dark-bg/70 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-light-bg dark:bg-dark-bg text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
                        <div className="bg-light-bg dark:bg-dark-bg px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div
                                    className={`mx-auto flex size-12 shrink-0 items-center justify-center rounded-full ${bgColor} sm:mx-0 sm:size-10`}>
                                    <Icon
                                        aria-hidden="true"
                                        className={`size-6 ${iconColor}`}
                                    />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <DialogTitle
                                        as="h3"
                                        className="text-base font-semibold text-light-primary-text dark:text-dark-primary-text">
                                        {title}
                                    </DialogTitle>
                                    <div className="mt-1">
                                        <p className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                                            {message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-light-bg dark:bg-dark-bg px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="button"
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={`inline-flex w-full justify-center rounded-md ${buttonColor} px-3 py-2 text-sm font-semibold text-white shadow-xs sm:ml-3 sm:w-auto`}>
                                {confirmText}
                            </button>
                            {showCancel && (
                                <button
                                    type="button"
                                    data-autofocus
                                    onClick={() => onClose()}
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                                    {cancelText}
                                </button>
                            )}
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
