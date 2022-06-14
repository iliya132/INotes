import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ValidationResult } from "../../controllers/types";
import { RootState } from "../store";
import { AuthState, User } from "../types";

const initialState: AuthState = {
    error: '',
    isAuth: undefined,
    user: undefined,
    validation: {
        isSucceded: false,
        errors: {}
    }
};

const slice = createSlice(
    {
        name: "authReducer",
        initialState: initialState,
        reducers:
        {
            setIsAuth: (state: AuthState, action: PayloadAction<boolean>) => {
                state.isAuth = action.payload;
            },
            setUser: (state: AuthState, action: PayloadAction<User>) => {
                state.user = action.payload
            },
            auth: (state: AuthState, action: PayloadAction<User>) => {
                state.isAuth = true;
                state.user = action.payload;
            },
            authError: (state: AuthState, action: PayloadAction<string>) => {
                state.isAuth = false;
                state.error = action.payload
            },
            validationError: (state: AuthState, action: PayloadAction<ValidationResult>) => {
                state.isAuth = false;
                state.validation = action.payload;
            },
            removeAuthErrors: (state: AuthState) => {
                state.error = "",
                state.validation = { isSucceded: true, errors: undefined }
            },
            logout: (state: AuthState) => {
                state.isAuth = false;
                state.user = undefined;
            }
        }

    }
)

export const { setIsAuth, setUser, auth, authError, validationError, removeAuthErrors, logout } = slice.actions;
export default slice.reducer;
export const currentUser = (state: RootState) => state.authReducer.user;
export const isAuth = (state: RootState) => state.authReducer.isAuth;
export const authErrors = (state: RootState) => state.authReducer.error;
export const validationErrors = (state: RootState) => state.authReducer.validation;
