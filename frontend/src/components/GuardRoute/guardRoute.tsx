import React from 'react';
import { Navigate } from 'react-router-dom';
import { IGuardRouteProps } from './types';

export function GuardRoute({ canActivate, redirectTo, children, onSuccess }: IGuardRouteProps) {
    if (!canActivate) {
        return <Navigate to={redirectTo} />;
    }
    if(onSuccess){
        onSuccess()
    }
    return children;
}
