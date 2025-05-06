import { useUser } from "@clerk/clerk-react";
import { Popover, Transition } from "@headlessui/react";
import {
    addDoc,
    collection,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import {
    Briefcase,
    ChevronDown,
    CircleArrowLeft,
    Clock,
    Code,
    FileUser,
    Filter,
    Info,
    Layers,
    ListFilter,
    SquarePlus,
    Star,
    X
} from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import EmptyDialog from "../../components/main/EmptyDialog";
import Loader from "../../components/main/Loader";
import { db } from "../../config/firebase";
import { useAlert } from "../../hooks/useAlert";

const MockInterviewForm = ({ setIsCreateModalOpen, isCreateModalOpen }) => {
    const [formData, setFormData] = useState({
        interviewName: "",
        jobDescription: "",
        programmingLanguage: "",
        technologyStack: "",
        experienceLevel: "entry-level",
        notifications: {
            comments: false,
            candidates: false,
            offers: false,
        },
    });

    const { showAlert, AlertComponent } = useAlert();
    const { user } = useUser();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                notifications: {
                    ...prev.notifications,
                    [name]: checked,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const setMockInterviewInfo = async () => {
        try {
            toast.promise(
                async () => {
                    const docRef = await addDoc(
                        collection(db, `users/${user.id}/mock-interviews`),
                        {
                            interviewName: formData.interviewName,
                            jobDescription: formData.jobDescription,
                            programmingLanguage: formData.programmingLanguage,
                            technologyStack: formData.technologyStack,
                            experienceLevel: formData.experienceLevel,
                            notifications: formData.notifications,
                            createdAt: serverTimestamp(),
                            userId: user.id,
                            isBookmarked: false,
                        }
                    );
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
        console.log("Form submitted", formData);

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
            className="w-3/5 select-none mx-auto text-light-primary-text dark:text-dark-primary-text"
            onSubmit={submitHandler}>
            <div className="flex flex-col gap-6">
                <CircleArrowLeft
                    onClick={cancleHandler}
                    className="size-8 text-light-fail dark:text-dark-fail hover:text-light-fail-hover dark:hover:text-dark-fail-hover"
                />
                <div className="space-y-12">
                    <div className="border-b border-neutral-300 dark:border-neutral-600 pb-12">
                        <h2 className="text-2xl font-semibold">
                            Create Mock Interview
                        </h2>
                        <p className="text-sm text-light-secondary dark:text-dark-secondary">
                            This information will be displayed publicly so be
                            careful
                        </p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
                                    value={formData.interviewName}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-light-secondary dark:focus:outline-dark-secondary sm:text-sm text-light-primary-text"
                                    required
                                />
                                <div className="flex gap-1 mt-1.5 items-center">
                                    <Info className="size-5 text-light-secondary dark:text-dark-secondary" />
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
                                        value={formData.jobDescription}
                                        onChange={(e) => {
                                            e.target.style.height = "auto";
                                            e.target.style.height =
                                                e.target.scrollHeight + "px";
                                            handleInputChange(e);
                                        }}
                                        className="w-full min-h-[80px] max-h-[300px] appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-light-primary-text outline-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-light-secondary dark:focus:outline-dark-secondary sm:text-sm/6 resize-none "
                                        required
                                    />
                                </div>
                                <div className="flex gap-1 mt-1.5 items-center">
                                    <Info className="size-5 text-light-secondary dark:text-dark-secondary" />
                                    <p className="text-xs text-light-secondary dark:text-dark-secondary">
                                        Write few lines about the job
                                        description.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-neutral-300 dark:border-neutral-600 pb-12">
                        <h2 className="text-xl font-semibold">
                            User Background & Skills
                        </h2>

                        <p className="text-sm text-light-secondary dark:text-dark-secondary">
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
                                        value={formData.programmingLanguage}
                                        onChange={handleInputChange}
                                        className="w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-light-primary-text outline-1  outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-light-secondary dark:focus:outline-dark-secondary sm:text-sm/6">
                                        <option value="">
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
                                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-5 text-gray-500"
                                    />
                                </div>
                                <div className="flex gap-1 mt-1.5 items-center">
                                    <Info className="size-5 text-light-secondary dark:text-dark-secondary" />
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
                                        value={formData.technologyStack}
                                        onChange={handleInputChange}
                                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-light-primary-text outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-light-secondary dark:focus:outline-dark-secondary sm:text-sm/6"
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
                                    <Info className="size-5 text-light-secondary dark:text-dark-secondary" />
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
                                                formData.experienceLevel ===
                                                "Entry"
                                            }
                                            onChange={handleInputChange}
                                            className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-light-secondary dark:checked:border-dark-secondary checked:bg-light-secondary dark:checked:bg-dark-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-secondary dark:focus-visible:outline-dark-secondary disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
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
                                                formData.experienceLevel ===
                                                "Mid"
                                            }
                                            onChange={handleInputChange}
                                            className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-light-secondary dark:checked:border-dark-secondary checked:bg-light-secondary dark:checked:bg-dark-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-secondary dark:focus-visible:outline-dark-secondary disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
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
                                                formData.experienceLevel ===
                                                "Senior"
                                            }
                                            onChange={handleInputChange}
                                            className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-light-secondary dark:checked:border-dark-secondary checked:bg-light-secondary dark:checked:bg-dark-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-secondary dark:focus-visible:outline-dark-secondary disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
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

                    <div className="border-b border-neutral-300 dark:border-neutral-600  pb-12">
                        <h2 className="text-xl font-semibold">
                            Session Feedback
                        </h2>
                        <p className="text-sm text-light-secondary dark:text-dark-secondary">
                            Receive detailed performance analysis
                        </p>

                        <div className="mt-10">
                            <fieldset>
                                <legend className="font-semibold">
                                    By email
                                </legend>
                                <div className="mt-4 space-y-3">
                                    <div className="flex gap-3">
                                        <div className="flex h-6 shrink-0 items-center">
                                            <div className="group grid size-4 grid-cols-1">
                                                <input
                                                    id="feedback-notify"
                                                    name="feedbackNotify"
                                                    type="checkbox"
                                                    aria-describedby="comments-description"
                                                    checked={
                                                        formData.notifications
                                                            .feedbackNotify
                                                    }
                                                    onChange={handleInputChange}
                                                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-light-secondary 
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
                                        <div className="space-y-1">
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
                                                        formData.notifications
                                                            .reminderNotify
                                                    }
                                                    onChange={handleInputChange}
                                                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-light-secondary checked:bg-light-secondary indeterminate:border-light-secondary indeterminate:bg-light-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-secondary disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
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
                                        <div className="space-y-1">
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
                                                        formData.notifications
                                                            .progressNotify
                                                    }
                                                    onChange={handleInputChange}
                                                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-light-secondary checked:bg-light-secondary indeterminate:border-light-secondary indeterminate:bg-light-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-secondary disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
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
                                        <div className="space-y-1">
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

const MockInterviewCard = ({ interview }) => {
    const { user } = useUser();
    const [isBookmarked, setIsBookmarked] = useState(interview.isBookmarked);
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate();

    const bookmarkHandler = async (e) => {
        e.stopPropagation();

        if (isUpdating) return; // Prevent multiple rapid clicks

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
            onClick={() => interviewCardHandler()}
            className="group w-full bg-white dark:bg-dark-bg rounded-lg shadow-sm border border-light-surface dark:border-dark-surface p-4 hover:shadow-md duration-200 transition-all hover:scale-[100.5%] cursor-pointer">
            <div className="flex items-start gap-4">
                <div className="bg-light-primary/10 dark:bg-dark-primary/10 p-3 rounded-lg">
                    <Briefcase className="w-5 h-5 text-light-primary dark:text-dark-primary" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium text-light-primary-text dark:text-dark-primary-text truncate">
                            {interview.interviewName || "Untitled Interview"}
                        </h3>
                        <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
  ${getLevelClass(interview.experienceLevel)}`}>
                            {interview.experienceLevel || "Mid"} Level
                        </span>
                    </div>

                    <p className="mt-1 text-sm text-light-secondary-text max-w-[90%] dark:text-dark-secondary-text line-clamp-2">
                        {interview.jobDescription || "No description provided"}
                    </p>

                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <div className="mt-3 flex flex-wrap gap-2">
                                <div className="inline-flex items-center text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-md">
                                    <Code className="w-3 h-3 mr-1 text-gray-500 dark:text-gray-400" />
                                    {interview.programmingLanguage ||
                                        "Not specified"}
                                </div>

                                <span className="inline-flex items-center text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-md">
                                    <Layers className="w-3 h-3 mr-1 text-gray-500 dark:text-gray-400" />
                                    {interview.technologyStack ||
                                        "Not specified"}
                                </span>
                            </div>

                            <div className="flex items-center mt-3 gap-3">
                                <div className="flex items-center text-xs text-light-secondary-text/50 dark:text-dark-secondary-text/50">
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
                                                ? "bg-green-500"
                                                : "bg-yellow-500"
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
                        <div className="px-5">
                            <Star
                                onClick={bookmarkHandler}
                                size={25}
                                className={`text-yellow-500 dark:text-yellow-400 cursor-pointer
                
                transition-all duration-200   group-hover:opacity-100 group-hover:scale-105 ${
                    isUpdating ? "opacity-50" : "hover:scale-110"
                } 
                ${
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

const FilterMenu = ({ filters, setFilters }) => {
    const isFiltersActive = () => {
        return (
            filters.status !== "all" ||
            filters.level !== "all" ||
            filters.technology !== "all" ||
            filters.language !== "all" ||
            filters.sort !== "newest"
        );
    };

    // Add this function to reset filters
    const resetFilters = () => {
        setFilters({
            status: "all",
            level: "all",
            technology: "all",
            language: "all",
            sort: "newest",
        });
    };

    return (
        <Popover className="relative">
            {({ open, close }) => (
                <>
                    <div className="flex items-center gap-2">
                        {isFiltersActive() && (
                            <button
                                onClick={resetFilters}
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
                                    isFiltersActive() &&
                                    "ring-2 ring-light-primary dark:ring-dark-primary"
                                }`}>
                            <Filter className="h-4 w-4" />
                            <span className="text-sm font-medium">
                                {isFiltersActive()
                                    ? `Filters (${
                                          Object.values(filters).filter(
                                              (value) =>
                                                  value !== "all" &&
                                                  value !== "newest"
                                          ).length
                                      })`
                                    : "Filters"}
                            </span>
                        </Popover.Button>
                    </div>

                    <Transition
                        as={Fragment}
                        enter="transition duration-200 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-150 ease-in"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0">
                        <Popover.Panel className="absolute right-0 z-50 mt-2 w-80 origin-top-right">
                            <div className="bg-white dark:bg-dark-bg rounded-xl shadow-lg ring-1 ring-black/5 p-6 space-y-4">
                                {/* Status Filter */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-light-secondary-text dark:text-dark-secondary-text">
                                        Status
                                    </label>
                                    <select
                                        value={filters.status}
                                        onChange={(e) => {
                                            setFilters((prev) => ({
                                                ...prev,
                                                status: e.target.value,
                                            }));
                                            close();
                                        }}
                                        className="w-full px-3 py-2 text-sm rounded-lg bg-light-surface dark:bg-dark-surface border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary">
                                        <option value="all">All Status</option>
                                        <option value="completed">
                                            Completed
                                        </option>
                                        <option value="in-progress">
                                            In Progress
                                        </option>
                                    </select>
                                </div>

                                {/* Level Filter */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-light-secondary-text dark:text-dark-secondary-text">
                                        Experience Level
                                    </label>
                                    <select
                                        value={filters.level}
                                        onChange={(e) => {
                                            setFilters((prev) => ({
                                                ...prev,
                                                level: e.target.value,
                                            }));
                                            close();
                                        }}
                                        className="w-full px-3 py-2 text-sm rounded-lg bg-light-surface dark:bg-dark-surface border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary">
                                        <option value="all">All Levels</option>
                                        <option value="Entry">
                                            Entry Level
                                        </option>
                                        <option value="Mid">Mid Level</option>
                                        <option value="Senior">
                                            Senior Level
                                        </option>
                                    </select>
                                </div>

                                {/* Technology Filter */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-light-secondary-text dark:text-dark-secondary-text">
                                        Technology
                                    </label>
                                    <select
                                        value={filters.technology}
                                        onChange={(e) => {
                                            setFilters((prev) => ({
                                                ...prev,
                                                technology: e.target.value,
                                            }));
                                            close();
                                        }}
                                        className="w-full px-3 py-2 text-sm rounded-lg bg-light-surface dark:bg-dark-surface border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary">
                                        <option value="all">
                                            All Technologies
                                        </option>
                                        <option value="Frontend">
                                            Frontend
                                        </option>
                                        <option value="Backend">Backend</option>
                                        <option value="Fullstack">
                                            Full Stack
                                        </option>
                                        <option value="Mobile">Mobile</option>
                                        <option value="Devops">DevOps</option>
                                    </select>
                                </div>

                                {/* Language Filter */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-light-secondary-text dark:text-dark-secondary-text">
                                        Programming Language
                                    </label>
                                    <select
                                        value={filters.language}
                                        onChange={(e) => {
                                            setFilters((prev) => ({
                                                ...prev,
                                                language: e.target.value,
                                            }));
                                            close();
                                        }}
                                        className="w-full px-3 py-2 text-sm rounded-lg bg-light-surface dark:bg-dark-surface border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary">
                                        <option value="all">
                                            All Languages
                                        </option>
                                        <option value="Javascript">
                                            JavaScript
                                        </option>
                                        <option value="Python">Python</option>
                                        <option value="Java">Java</option>
                                        <option value="C++">C++</option>
                                        <option value="C#">C#</option>
                                    </select>
                                </div>

                                {/* Sort Order */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-light-secondary-text dark:text-dark-secondary-text">
                                        Sort By
                                    </label>
                                    <select
                                        value={filters.sort}
                                        onChange={(e) => {
                                            setFilters((prev) => ({
                                                ...prev,
                                                sort: e.target.value,
                                            }));
                                            close();
                                        }}
                                        className="w-full px-3 py-2 text-sm rounded-lg bg-light-surface dark:bg-dark-surface border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary">
                                        <option value="newest">
                                            Newest First
                                        </option>
                                        <option value="oldest">
                                            Oldest First
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

// Add this after the FilterMenu component
const StarredButton = ({ isStarred, setIsStarred }) => {
    return (
        <button onClick={() => setIsStarred(!isStarred)}>
            <Star
                className={`h-7 w-7 ${
                    isStarred
                        ? "text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400"
                        : "ext-yellow-500 dark:text-yellow-400"
                }`}
            />
        </button>
    );
};


const MockInterviewHome = ({ isCreateModalOpen, setIsCreateModalOpen }) => {
    const [allInterviews, setAllInterviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: "all", // all, completed, in-progress
        level: "all", // all, Entry, Mid, Senior
        technology: "all", // all, Frontend, Backend, etc.
        language: "all", // all, Javascript, Python, etc.
        sort: "newest", // newest, oldest
    });

    const { user } = useUser();

    const fetchInterviews = async () => {
        try {
            const response = await getDocs(
                query(
                    collection(db, `users/${user.id}/mock-interviews`),
                    orderBy("createdAt", "desc")
                )
            );

            const interviews = response.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAtMs: doc.data().createdAt?.seconds * 1000 || Date.now(),
            }));

            setAllInterviews(interviews);
        } catch (error) {
            setError("Failed to fetch interviews. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInterviews();
    }, []);

    const [isStarred, setIsStarred] = useState(false);

    if (isLoading) {
        return (
            <div>
                <Loader />
            </div>
        );
    }

    const handleInterviewUpdate = (id, updates) => {
        setAllInterviews((interviews) =>
            interviews.map((interview) =>
                interview.id === id ? { ...interview, ...updates } : interview
            )
        );
    };

    const getFilteredInterviews = () => {
        return allInterviews
            .filter((interview) => {
                // First check if starred filter is active
                if (isStarred && !interview.isBookmarked) {
                    return false;
                }

                // Only apply other filters if the interview passed the starred check
                const statusMatch =
                    filters.status === "all" ||
                    (filters.status === "completed" && interview.isCompleted) ||
                    (filters.status === "in-progress" &&
                        !interview.isCompleted);

                const levelMatch =
                    filters.level === "all" ||
                    interview.experienceLevel === filters.level;

                const techMatch =
                    filters.technology === "all" ||
                    interview.technologyStack === filters.technology;

                const langMatch =
                    filters.language === "all" ||
                    interview.programmingLanguage === filters.language;

                return statusMatch && levelMatch && techMatch && langMatch;
            })
            .sort((a, b) => {
                if (filters.sort === "newest") {
                    return b.createdAtMs - a.createdAtMs;
                }
                return a.createdAtMs - b.createdAtMs;
            });
    };

    return (
        <div className="flex flex-col  min-h-screen bg-light-bg dark:bg-dark-surface text-light-primary-text dark:text-dark-primary-text gap-10 px-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Mock Interviews</h1>
                    <p className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                        Prepare for your next interview with our mock interview
                        sessions.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full 
                                     bg-gradient-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary
                                     px-6 py-3 transition-all duration-300 ease-out
                                     hover:scale-[1.02] hover:shadow-lg
                                     active:scale-[0.98]
                                     disabled:cursor-not-allowed disabled:opacity-50
                                     sm:px-8"
                    aria-label="Create new mock interview">
                    <span
                        className="absolute inset-0 bg-gradient-to-r from-light-secondary to-light-primary dark:from-dark-secondary dark:to-dark-primary 
                                               opacity-0 transition-opacity duration-300 ease-out
                                               group-hover:opacity-100"></span>

                    <SquarePlus
                        className="relative h-5 w-5 text-white transition-transform duration-200 
                                                ease-out group-hover:scale-110"
                    />

                    <span className="relative hidden text-sm font-medium text-white sm:inline-block">
                        New Interview
                    </span>
                </button>
            </div>

            {allInterviews.length > 0 ? (
                <div className="flex flex-col gap-4 items-center">
                    <div className="w-full flex justify-end gap-2">
                        <FilterMenu filters={filters} setFilters={setFilters} />
                        <StarredButton
                            isStarred={isStarred}
                            setIsStarred={setIsStarred}
                        />
                    </div>
                    {getFilteredInterviews().length > 0 ? (
                        <div className="w-full max-w-7xl space-y-3">
                            {getFilteredInterviews().map((interview) => (
                                <MockInterviewCard
                                    key={interview.id}
                                    interview={{
                                        id: interview.id,
                                        ...interview,
                                    }}
                                    onUpdate={handleInterviewUpdate}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="w-full flex flex-col items-center justify-center py-20 text-center">
                            <div className="bg-light-surface/50 dark:bg-dark-surface/50 rounded-lg p-8">
                                <ListFilter className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                                <h3 className="text-lg font-medium text-light-primary-text dark:text-dark-primary-text mb-2">
                                    No matches found
                                </h3>
                                <p className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                                    Try adjusting your filters or create a new
                                    interview
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="w-full mt-40 flex justify-center items-center">
                    <EmptyDialog
                        icon={<FileUser size={60} />}
                        text="Create a new Mock Interview"
                        onClick={() => setIsCreateModalOpen(true)}
                    />
                </div>
            )}
        </div>
    );
};

const MockInterviewContent = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return isCreateModalOpen ? (
        <MockInterviewForm
            setIsCreateModalOpen={setIsCreateModalOpen}
            isCreateModalOpen={isCreateModalOpen}
        />
    ) : (
        <MockInterviewHome
            setIsCreateModalOpen={setIsCreateModalOpen}
            isCreateModalOpen={isCreateModalOpen}
        />
    );
};

export default MockInterviewContent;
