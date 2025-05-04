import { useAuth, useUser } from "@clerk/clerk-react";
import { Navigate, useParams } from "react-router-dom";
import Loader from "../main/Loader";

const ProtectedRoute = ({ children }) => {
    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const { user_id } = useParams();

    if (!isLoaded) {
        return <Loader />;
    }

    if (!isSignedIn) {
        return <Navigate to="/" replace />;
    }

    if (user_id && user_id !== user.id) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;