/* eslint-disable no-undef */

import { ValidationResult } from "../../controllers/types";
import { store } from "../store";
import { AuthState, User } from "../types";
import { auth, authError, logout, removeAuthErrors, resetStateForTests, setIsAuth, setUser, validationError } from "./authReducer";
import { setState } from "./notebooksReducer";

beforeEach(() => {
    jest.resetAllMocks();
    store.dispatch(setState([]));
    store.dispatch(resetStateForTests());
})

describe('auth reducer tests', () => {
    it('setup correct initial state', () => {
        const expected: AuthState = {
            error: '',
            isAuth: undefined,
            user: undefined,
            validation: {
                isSucceded: false,
                errors: {}
            }
        };
        expect(getAuthState()).toEqual(expected);
    })

    it('can set is auth', () => {
        store.dispatch(setIsAuth(true));
        const state = getAuthState();
        expect(state.isAuth).toBe(true);
    })

    it('can set user', () => {
        const user = getTestUser();
        store.dispatch(setUser(user));
        const state = getAuthState();
        expect(state.user).toEqual(user);
    })

    it('can auth', () => {
        const user = getTestUser();
        store.dispatch(auth(user));
        const state = getAuthState();
        expect(state.user).toEqual(user);
        expect(state.isAuth).toBe(true);
    })

    it('can set auth error', () => {
        store.dispatch(authError('error'));
        const state = getAuthState();
        expect(state.isAuth).toBe(false);
        expect(state.error).toEqual('error');
    })

    it('can set validation error', () => {
        const validationResult: ValidationResult = {
            errors: {login: 'incorrect login'},
            isSucceded: false
        };
        store.dispatch(validationError(validationResult));
        const state = getAuthState();
        expect(state.isAuth).toBe(false);
        expect(state.validation).toEqual(validationResult);
    })

    it('can remove auth errors', () => {
        const validationResult: ValidationResult = {
            errors: {login: 'incorrect login'},
            isSucceded: false
        };
        store.dispatch(validationError(validationResult));
        let state = getAuthState();
        expect(state.isAuth).toBe(false);
        expect(state.validation).toEqual(validationResult);
        store.dispatch(removeAuthErrors());
        state = getAuthState();
        expect(state.isAuth).toBe(false);
        expect(state.error).toEqual('');
        expect(state.validation).toEqual({ isSucceded: true, errors: undefined });
    })

    it('can logout', () => {
        const user = getTestUser();
        store.dispatch(auth(user));
        let state = getAuthState();
        expect(state.user).toEqual(user);
        expect(state.isAuth).toBe(true);

        store.dispatch(logout());
        state = getAuthState();
        expect(state.isAuth).toBe(false);
        expect(state.user).toBeUndefined();
    })
})

function getAuthState() { return store.getState().authReducer; }

function getTestUser(): User { return { roles: ['USER'], userName: 'test-user', avatarUrl: undefined } }