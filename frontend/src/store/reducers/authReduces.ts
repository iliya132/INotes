import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ValidationResult } from "../../controllers/types";
import { RootState } from "../store";
import { AuthState, User } from "../types";

const initialState: AuthState = {
    error: '',
    isAuth: true,
    user: {
        email: 'test@test.ru'
    },
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
            validationError: (state:AuthState, action: PayloadAction<ValidationResult>) => {
                state.isAuth = false;
                state.validation = action.payload;
            }
        }

    }
)

export const { setIsAuth, setUser, auth, authError, validationError } = slice.actions;
export default slice.reducer;
export const currentUser = (state: RootState) => state.authReducer.user;
export const isAuth = (state: RootState) => state.authReducer.isAuth;
export const authErrors = (state: RootState) => state.authReducer.error;