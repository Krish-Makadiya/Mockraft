import { useState } from "react";
import AptitudeForm from "../Aptitude/AptitudeForm";
import AptitudeTestHomepage from "./AptitudeTestHomepage";

const AptitudeTestContent = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return isCreateModalOpen ? (
        <AptitudeForm
            setIsCreateModalOpen={setIsCreateModalOpen}
            isCreateModalOpen={isCreateModalOpen}
        />
    ) : (
        <AptitudeTestHomepage
            setIsCreateModalOpen={setIsCreateModalOpen}
            isCreateModalOpen={isCreateModalOpen}
        />
    );
};

export default AptitudeTestContent;
