import { useUser } from "@clerk/clerk-react";
import {
    addDoc,
    collection,
    serverTimestamp,
    doc,
    updateDoc,
    increment,
} from "firebase/firestore";
import { ChevronDown, CircleArrowLeft, Info } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { db } from "../../config/firebase";
import { useAlert } from "../../hooks/useAlert";

const MockInterviewForm = ({ setIsCreateModalOpen }) => {
    const [formState, setFormState] = useState({
        interviewName: "",
        jobDescription: "",
        programmingLanguage: "",
        technologyStack: "",
        experienceLevel: "entry-level",
        notifications: {
            feedback: false,
            progress: false,
            reminders: false,
        },
    });

    const { showAlert, AlertComponent } = useAlert();
    const { user } = useUser();

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormState((prev) => {
            if (type === "checkbox") {
                return {
                    ...prev,
                    notifications: {
                        ...prev.notifications,
                        [name]: checked,
                    },
                };
            }
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    // Handle form submission
    const setMockInterviewInfo = async () => {
        try {
            toast.promise(
                async () => {
                    const docRef = await addDoc(
                        collection(db, `users/${user.id}/mock-interviews`),
                        {
                            interviewName: formState.interviewName,
                            jobDescription: formState.jobDescription,
                            programmingLanguage: formState.programmingLanguage,
                            technologyStack: formState.technologyStack,
                            experienceLevel: formState.experienceLevel,
                            notifications: formState.notifications,
                            createdAt: serverTimestamp(),
                            userId: user.id,
                            isBookmarked: false,
                        }
                    );

                    // Increment interviewsCreated for the user
                    const userRef = doc(db, "users", user.id);
                    await updateDoc(userRef, {
                        interviewsCreated: increment(1),
                    });

                    window.scrollTo({ top: 0, behavior: "smooth" });
                    return docRef;
                },
                {
                    loading: "Analyzing job description...",
                    success: "Your practice arena is ready!",
                    error: "Oops, pieces didn't connect - retry?",
                }
            );
            setIsCreateModalOpen(false);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log("Form submitted", formState);

        showAlert({
            title: "Ready to Practice?",
            message:
                "This will generate a mock interview based on your provided details.",
            type: "info",
            onConfirm: () => {
                setMockInterviewInfo();
            },
            confirmText: "Create Interview",
            cancelText: "Review Details",
        });
    };

    const cancleHandler = (e) => {
        e.preventDefault();
        showAlert({
            title: "Wait! You have unsaved work",
            type: "warning",
            onConfirm: () => {
                setIsCreateModalOpen(false);
            },
            message:
                "The interview details you've entered will be permanently deleted if you leave this page.",
            confirmText: "Discard Changes",
            cancelText: "Keep Working",
        });
    };

    return (
        <form
            className="md:w-3/5 w-[90vw] mx-auto text-light-primary-text dark:text-dark-primary-text"
            onSubmit={submitHandler}>
            <div className="flex flex-col">
                <div className="flex items-center md:gap-5 gap-2 md:ml-0 ml-12">
                    <CircleArrowLeft
                        onClick={cancleHandler}
                        className="size-8 text-light-fail md:block hidden dark:text-dark-fail hover:text-light-fail-hover dark:hover:text-dark-fail-hover"
                    />
                    <div>
                        <h2 className="md:text-3xl text-xl font-semibold">
                            Create Mock Interview
                        </h2>
                        <p className="md:text-sm text-xs text-light-secondary dark:text-dark-secondary">
                            This information will be only displayed to you.
                        </p>
                    </div>
                </div>
                <div className="space-y-12">
                    <div className="border-b border-neutral-300 dark:border-neutral-600 pb-12 mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium">
                                Mock-Interview Name
                            </label>

                            <input
                                id="username"
                                name="interviewName"
                                type="text"
                                placeholder="Enter the name of the interview"
                                value={formState.interviewName}
                                onChange={handleInputChange}
                                className="block w-full rounded-md bg-light-surface dark:bg-dark-bg px-3 md:py-2 py-3 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-light-secondary dark:focus:outline-dark-secondary md:text-base text-sm dark:text-dark-primary-text text-light-primary-text"
                                required
                            />
                            <div className="flex gap-1 mt-1.5 items-center">
                                <Info className="md:size-5 size-4 text-light-secondary dark:text-dark-secondary" />
                                <p className="text-xs text-light-secondary dark:text-dark-secondary">
                                    It will be displayed on your dashboard
                                    profile.
                                </p>
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label
                                htmlFor="about"
                                className="block text-sm font-medium">
                                Job Description
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="about"
                                    name="jobDescription"
                                    rows={3}
                                    placeholder="Write a few lines about the job description."
                                    value={formState.jobDescription}
                                    onChange={(e) => {
                                        e.target.style.height = "auto";
                                        e.target.style.height =
                                            e.target.scrollHeight + "px";
                                        handleInputChange(e);
                                    }}
                                    className="w-full min-h-[80px] max-h-[300px] appearance-none rounded-md bg-light-surface dark:bg-dark-bg py-2 pr-8 pl-3 md:text-base text-sm text-light-primary-text dark:text-dark-primary-text outline-1 outline-gray-300 dark:outline-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-light-secondary placeholder:text-gray-400 dark:focus:outline-dark-secondary  resize-none"
                                    required
                                />
                            </div>
                            <div className="flex gap-1 mt-1.5 items-center">
                                <Info className="md:size-5 size-4 text-light-secondary dark:text-dark-secondary" />
                                <p className="text-xs text-light-secondary dark:text-dark-secondary">
                                    Write few lines about the job description.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-neutral-300 dark:border-neutral-600 pb-12">
                        <h2 className="md:text-xl text-[18px] font-semibold">
                            User Background & Skills
                        </h2>

                        <p className="md:text-sm text-xs text-light-secondary dark:text-dark-secondary">
                            Use a permanent address where you can receive mail.
                        </p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="programming-language"
                                    className="block text-sm font-medium">
                                    Programming Language
                                </label>
                                <div className="mt-2 relative">
                                    <select
                                        id="programming-language"
                                        name="programmingLanguage"
                                        required
                                        value={formState.programmingLanguage}
                                        onChange={handleInputChange}
                                        className="w-full appearance-none rounded-md bg-light-surface dark:bg-dark-bg py-2 pr-8 pl-3 text-light-primary-text dark:text-dark-primary-text outline-1 outline-gray-300 dark:outline-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-light-secondary dark:focus:outline-dark-secondary md:text-base text-sm">
                                        <option value="" disabled>
                                            Select a language
                                        </option>
                                        <optgroup label="Popular Languages">
                                            <option value="Javascript">
                                                JavaScript/TypeScript
                                            </option>
                                            <option value="Python">
                                                Python
                                            </option>
                                            <option value="Java">Java</option>
                                            <option value="C++">C++</option>
                                            <option value="C#">C#</option>
                                        </optgroup>
                                        <optgroup label="Web Technologies">
                                            <option value="PHP">PHP</option>
                                            <option value="Ruby">Ruby</option>
                                            <option value="Golang">Go</option>
                                            <option value="Rust">Rust</option>
                                        </optgroup>
                                    </select>
                                    <ChevronDown
                                        aria-hidden="true"
                                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-5 text-gray-400"
                                    />
                                </div>
                                <div className="flex gap-1 mt-1.5 items-center">
                                    <Info className="md:size-5 size-4 text-light-secondary dark:text-dark-secondary" />
                                    <p className="text-xs text-light-secondary dark:text-dark-secondary">
                                        Choose language for technical interview
                                    </p>
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="technology"
                                    className="block text-sm font-medium">
                                    Technology Stack
                                </label>
                                <div className="mt-2 grid grid-cols-1">
                                    <select
                                        id="technology"
                                        name="technologyStack"
                                        value={formState.technologyStack}
                                        onChange={handleInputChange}
                                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-light-surface dark:bg-dark-bg py-2 pr-8 pl-3 text-light-primary-text dark:text-dark-primary-text outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-light-secondary dark:focus:outline-dark-secondary md:text-base text-sm"
                                        required>
                                        <option value="">
                                            Select your expertise
                                        </option>
                                        <option value="Frontend">
                                            Frontend Development
                                        </option>
                                        <option value="Backend">
                                            Backend Development
                                        </option>
                                        <option value="Fullstack">
                                            Full Stack Development
                                        </option>
                                        <option value="Mobile">
                                            Mobile Development
                                        </option>
                                        <option value="Devops">
                                            DevOps & Cloud
                                        </option>
                                    </select>
                                    <ChevronDown className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4" />
                                </div>
                                <div className="flex gap-1 mt-1.5 items-center">
                                    <Info className="md:size-5 size-4 text-light-secondary dark:text-dark-secondary" />
                                    <p className="text-xs text-light-secondary dark:text-dark-secondary">
                                        Choose your primary area of technical
                                        expertise
                                    </p>
                                </div>
                            </div>
                            <fieldset>
                                <legend className="text-sm">
                                    Experience Level{" "}
                                </legend>
                                <div className="mt-4 space-y-2 w-100">
                                    <div className="flex items-center gap-x-3">
                                        <input
                                            id="entry-level"
                                            name="experienceLevel"
                                            type="radio"
                                            value="Entry"
                                            checked={
                                                formState.experienceLevel ===
                                                "Entry"
                                            }
                                            onChange={handleInputChange}
                                            className="relative size-4 appearance-none rounded-full border border-gray-300 bg-light-surface dark:bg-dark-bg before:absolute before:inset-1 before:rounded-full before:bg-light-surface dark:before:bg-dark-bg not-checked:before:hidden checked:border-light-secondary dark:checked:border-dark-secondary checked:bg-light-secondary dark:checked:bg-dark-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-secondary dark:focus-visible:outline-dark-secondary disabled:border-gray-300 disabled:bg-light-surface disabled:before:bg-light-surface forced-colors:appearance-auto forced-colors:before:hidden"
                                            required
                                        />
                                        <label
                                            htmlFor="entry-level"
                                            className="text-sm">
                                            Entry Level
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-x-3">
                                        <input
                                            id="mid-level"
                                            name="experienceLevel"
                                            type="radio"
                                            value="Mid"
                                            checked={
                                                formState.experienceLevel ===
                                                "Mid"
                                            }
                                            onChange={handleInputChange}
                                            className="relative size-4 appearance-none rounded-full border border-gray-300 bg-light-surface dark:bg-dark-bg before:absolute before:inset-1 before:rounded-full before:bg-light-surface dark:before:bg-dark-bg not-checked:before:hidden checked:border-light-secondary dark:checked:border-dark-secondary checked:bg-light-secondary dark:checked:bg-dark-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-secondary dark:focus-visible:outline-dark-secondary disabled:border-gray-300 disabled:bg-light-surface disabled:before:bg-light-surface forced-colors:appearance-auto forced-colors:before:hidden"
                                        />
                                        <label
                                            htmlFor="mid-level"
                                            className="text-sm">
                                            Mid Level
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-x-3">
                                        <input
                                            id="senior-level"
                                            name="experienceLevel"
                                            type="radio"
                                            value="Senior"
                                            checked={
                                                formState.experienceLevel ===
                                                "Senior"
                                            }
                                            onChange={handleInputChange}
                                            className="relative size-4 appearance-none rounded-full border border-gray-300 bg-light-surface dark:bg-dark-bg before:absolute before:inset-1 before:rounded-full before:bg-light-surface dark:before:bg-dark-bg not-checked:before:hidden checked:border-light-secondary dark:checked:border-dark-secondary checked:bg-light-secondary dark:checked:bg-dark-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-secondary dark:focus-visible:outline-dark-secondary disabled:border-gray-300 disabled:bg-light-surface disabled:before:bg-light-surface forced-colors:appearance-auto forced-colors:before:hidden"
                                            required
                                        />
                                        <label
                                            htmlFor="senior-level"
                                            className="text-sm">
                                            Senior Level
                                        </label>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>

                    <div className="border-b border-neutral-300 dark:border-neutral-600 pb-12">
                        <h2 className="md:text-xl text-[18px] font-semibold">
                            Session Feedback
                        </h2>
                        <p className="md:text-sm text-xs text-light-secondary dark:text-dark-secondary">
                            Receive detailed performance analysis
                        </p>

                        <div className="mt-10">
                            <fieldset>
                                <legend className="font-semibold">
                                    By email
                                </legend>
                                <div className="mt-4 md:space-y-3 space-y-5">
                                    <div className="flex gap-3">
                                        <div className="flex h-6 shrink-0 items-center">
                                            <div className="group grid size-4 grid-cols-1">
                                                <input
                                                    id="feedback-notify"
                                                    name="feedbackNotify"
                                                    type="checkbox"
                                                    aria-describedby="comments-description"
                                                    checked={
                                                        formState.notifications
                                                            .feedbackNotify
                                                    }
                                                    onChange={handleInputChange}
                                                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-light-surface dark:bg-dark-bg checked:border-light-secondary 
                                    checked:bg-light-secondary 
                                    indeterminate:border-light-secondary 
                                    indeterminate:bg-light-secondary
                                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-secondary
                                     disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                                />
                                                <svg
                                                    fill="none"
                                                    viewBox="0 0 14 14"
                                                    className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25">
                                                    <path
                                                        d="M3 8L6 11L11 3.5"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="opacity-0 group-has-checked:opacity-100"
                                                    />
                                                    <path
                                                        d="M3 7H11"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="opacity-0 group-has-indeterminate:opacity-100"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="md:space-y-1 space-y-0">
                                            <label
                                                htmlFor="feedback-notify"
                                                className="block text-sm font-medium">
                                                Interview Feedback
                                            </label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Receive AI-generated feedback
                                                after mock sessions
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex h-6 shrink-0 items-center">
                                            <div className="group grid size-4 grid-cols-1">
                                                <input
                                                    id="reminder-notify"
                                                    name="reminderNotify"
                                                    type="checkbox"
                                                    aria-describedby="candidates-description"
                                                    checked={
                                                        formState.notifications
                                                            .reminderNotify
                                                    }
                                                    onChange={handleInputChange}
                                                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-light-surface dark:bg-dark-bg checked:border-light-secondary checked:bg-light-secondary indeterminate:border-light-secondary indeterminate:bg-light-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-secondary disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                                />
                                                <svg
                                                    fill="none"
                                                    viewBox="0 0 14 14"
                                                    className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25">
                                                    <path
                                                        d="M3 8L6 11L11 3.5"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="opacity-0 group-has-checked:opacity-100"
                                                    />
                                                    <path
                                                        d="M3 7H11"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="opacity-0 group-has-indeterminate:opacity-100"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="md:space-y-1 space-y-0">
                                            <label
                                                htmlFor="reminder-notify"
                                                className="block text-sm font-medium">
                                                Practice Reminders
                                            </label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Get nudges to complete pending
                                                interview prep
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex h-6 shrink-0 items-center">
                                            <div className="group grid size-4 grid-cols-1">
                                                <input
                                                    id="progress-notify"
                                                    name="progressNotify"
                                                    type="checkbox"
                                                    aria-describedby="offers-description"
                                                    checked={
                                                        formState.notifications
                                                            .progressNotify
                                                    }
                                                    onChange={handleInputChange}
                                                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-light-surface dark:bg-dark-bg checked:border-light-secondary checked:bg-light-secondary indeterminate:border-light-secondary indeterminate:bg-light-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-secondary disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                                />
                                                <svg
                                                    fill="none"
                                                    viewBox="0 0 14 14"
                                                    className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25">
                                                    <path
                                                        d="M3 8L6 11L11 3.5"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="opacity-0 group-has-checked:opacity-100"
                                                    />
                                                    <path
                                                        d="M3 7H11"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="opacity-0 group-has-indeterminate:opacity-100"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="md:space-y-1 space-y-0">
                                            <label
                                                htmlFor="progress-notify"
                                                className="block text-sm font-medium">
                                                Progress Updates
                                            </label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Weekly reports on your
                                                improvement metrics
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="button"
                    onClick={cancleHandler}
                    className="rounded-md bg-light-fail dark:bg-dark-fail px-3 py-2 text-white text-sm font-semibold shadow-xs hover:bg-light-fail-hover dark:hover:bg-dark-fail-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-fail dark:focus-visible:outline-dark-fail">
                    Cancel
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-light-secondary dark:bg-dark-secondary px-3 py-2 text-sm font-semibold text-white shadow-xs dark:hover:bg-dark-secondary-hover hover:bg-light-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-secondary dark:focus-visible:outline-dark-secondary">
                    Save
                </button>
            </div>
            <AlertComponent />
        </form>
    );
};

export default MockInterviewForm;
