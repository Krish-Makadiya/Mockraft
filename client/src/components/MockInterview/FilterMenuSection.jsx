import React, { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { Filter, X, Star } from "lucide-react";

/**
 * FilterMenuSection
 * - The filter options (labels, order, etc.) are static inside the component.
 * - The filters state and setFilters function are passed as props.
 * - The StarredButton is now included as a static button.
 */
export default function FilterMenuSection({ filters, setFilters, isStarred, setIsStarred }) {
    const isFiltersActive = () => {
        return (
            filters.status !== "all" ||
            filters.level !== "all" ||
            filters.technology !== "all" ||
            filters.language !== "all" ||
            filters.sort !== "newest"
        );
    };

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
                        {/* StarredButton added here */}
                        <button onClick={() => setIsStarred(!isStarred)}>
                            <Star
                                className={`h-7 w-7 ${
                                    isStarred
                                        ? "text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400"
                                        : "text-yellow-500 dark:text-yellow-400"
                                }`}
                            />
                        </button>
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
                                {/* ...existing filter controls... */}
                                {/* (No changes needed here) */}
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
                                        className="w-full px-3 py-2 text-sm rounded-lg bg-light-surface dark:bg-dark-surface border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary">
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
                                        className="w-full px-3 py-2 text-sm rounded-lg bg-light-surface dark:bg-dark-surface border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary">
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
                                        className="w-full px-3 py-2 text-sm rounded-lg bg-light-surface dark:bg-dark-surface border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary">
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
                                        className="w-full px-3 py-2 text-sm rounded-lg bg-light-surface dark:bg-dark-surface border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary">
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
                                        className="w-full px-3 py-2 text-sm rounded-lg bg-light-surface dark:bg-dark-surface border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary">
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
}