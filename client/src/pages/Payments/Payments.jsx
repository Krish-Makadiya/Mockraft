import React from 'react'
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/main/Sidebar';
import PaymentsContent from './PaymentsContent';

const Payments = ({ tabs }) => {
  const location = useLocation();

    const getActiveTab = () => {
        return (
            tabs.find((tab) => tab.path === location.pathname)?.name ||
            tabs[0].name
        );
    };

    return (
        <div className="flex relative">
            <Sidebar tabs={tabs} getActiveTab={getActiveTab} />

            <div className="h-screen w-full bg-light-bg dark:bg-dark-surface md:py-10 py-6 md:px-8 px-2">
                <PaymentsContent />
            </div>
        </div>
    );
}

export default Payments