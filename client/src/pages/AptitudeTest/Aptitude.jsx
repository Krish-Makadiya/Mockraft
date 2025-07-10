import { useLocation } from 'react-router-dom';
import AptitudeTestContent from "./AptitudeTestContent"
import Sidebar from '../../components/main/Sidebar';

const Aptitude = ({ tabs }) => {
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

            <div className="h-full w-full bg-light-bg dark:bg-dark-surface md:py-10 md:px-8 py-5">
                <AptitudeTestContent />
            </div>
        </div>
    );
}

export default Aptitude