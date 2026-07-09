import { useContext, type JSX } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../contexts/AuthContext";

interface Props {
    children: JSX.Element;
}

export default function PrivateRoute({ children }: Props) {
    const { autenticado } = useContext(AuthContext);

    if (!autenticado) {
        return <Navigate to="/login" replace />;
    }

    return children;
}