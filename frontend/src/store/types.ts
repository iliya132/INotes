import { ValidationResult } from "../controllers/types";

export interface User {
    email: string;
    avatar?: string;
}

export interface AuthState {
    isAuth: boolean;
    user?: User;
    error: string;
    validation: ValidationResult;
}
