import { useState } from "react";
import AptitudeForm from "./AptitudeForm";
import AptitudeAllQuestionHomepage from "./AptitudeHomepage";

const AptitudeContent = () => {
    return (
        <AptitudeForm
            setIsCreateModalOpen={setIsCreateModalOpen}
            isCreateModalOpen={isCreateModalOpen}
        />
    );
};

export default AptitudeContent;
