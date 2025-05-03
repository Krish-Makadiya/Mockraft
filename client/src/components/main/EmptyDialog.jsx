import React from "react";

const EmptyDialog = ({ icon, text, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="group border-2 border-dashed border-light-secondary dark:border-dark-secondary rounded-xl w-full max-w-md h-48 flex flex-col justify-center items-center cursor-pointer bg-light-secondary/10 dark:bg-dark-secondary/10 hover:bg-light-bg dark:hover:bg-dark-bg transition dark:hover:">
            <div className="text-4xl mb-4 text-light-primary-text dark:text-dark-primary-text group-hover:text-light-secondary-text dark:group-hover:text-dark-secondary-text">{icon}</div>
            <p className="text-base font-medium text-light-primary-text dark:text-dark-primary-text group-hover:text-light-secondary-text dark:group-hover:text-dark-secondary-text">{text}</p>
        </div>
    );
};

export default EmptyDialog;
