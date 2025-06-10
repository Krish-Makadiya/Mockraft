import { useState } from "react";
import MockInterviewForm from "../../components/MockInterview/MockInterviewForm";
import MockInterviewHomepage from "../../components/MockInterview/MockInterviewHomepage";


const MockInterviewContent = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return isCreateModalOpen ? (
        <MockInterviewForm
            setIsCreateModalOpen={setIsCreateModalOpen}
            isCreateModalOpen={isCreateModalOpen}
        />
    ) : (
        <MockInterviewHomepage
            setIsCreateModalOpen={setIsCreateModalOpen}
            isCreateModalOpen={isCreateModalOpen}
        />
    );
};

export default MockInterviewContent;



