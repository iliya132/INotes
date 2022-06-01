import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AuthState, User } from "../types";

const initialState: AuthState = {
    error: '',
    isAuth: true,
    user: {
        email: 'test@test.ru'
    },
};

const slice = createSlice(
    {
        name: "authReducer",
        initialState: initialState,
        reducers:
        {
            setIsAuth: (state, action: PayloadAction<boolean>) => {
                state.isAuth = action.payload;
            },
            setUser: (state, action: PayloadAction<User>) => {
                state.user = action.payload
            }
        }

    }
)

export const { setIsAuth, setUser } = slice.actions;
export default slice.reducer;
export const currentUser = (state: RootState) => state.authReducer.user;
export const isAuth = (state: RootState) => state.authReducer.isAuth;
export const authErrors = (state: RootState) => state.authReducer.error;