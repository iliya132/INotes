import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { IProtectedRouteProps } from "./types";

export function ProtectedRoute(props: IProtectedRouteProps) {
    const { isAuth, children, redirectTo } = props;
    const location = useLocation();
    const redirectUrl = redirectTo || location.pathname;

    if (!isAuth) {
        return <Navigate to="/login" state={{ redirectTo: redirectUrl }} />;
    }
    return children;
}
