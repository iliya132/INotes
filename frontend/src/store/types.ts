import { ValidationResult } from "../controllers/types";

export interface User {
    userName: string;
    avatar?: string;
    roles: string[];
}

export interface AuthState {
    isAuth?: boolean;
    user?: User;
    error: string;
    validation: ValidationResult;
}
