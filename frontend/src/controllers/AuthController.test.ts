/* eslint-disable no-undef */
import authController from "./AuthController";
import axios from 'axios';
import { User, INotebookWithNotes } from '../store/types';
import { jest } from '@jest/globals';
import { store } from '../store/store';
import { setState } from "../store/reducers/notebooksReducer";
import { authError, logout, validationError } from "../store/reducers/authReducer";

jest.mock('axios');

const user: User = {
    userName: 'test-username@test.ru',
    roles: ['USER'],
    avatarUrl: undefined
}

const notebookWithNotes: INotebookWithNotes[] = [
    {
        id: 0,
        color: 'red',
        name: 'test-notebook',
        notes: [{
            content: 'abc', id: 0,
            isNew: false,
            isPublicUrlShared: false,
            name: 'abc',
            parent: { color: 'red', id: 0, name: 'test-notebook' },
            publicUrl: 'fasdfadsf'
        }]
    }
]

beforeEach(() => {
    jest.resetAllMocks();
    store.dispatch(setState([]));
    store.dispatch(logout());
    store.dispatch(validationError({ errors: '', isSucceded: false }));
    store.dispatch(authError(''));
})

describe('auth controller test', () => {
    test('could validate auth', async () => {
        (axios.get as jest.Mock).mockResolvedValue({
            status: 200,
            data: true
        })

        await authController.validateAuthenticated()
            .then(resp => {
                expect(resp).toBe(true)
            })
    })

    test('when not authenticated and validate then return false', async () => {
        (axios.get as jest.Mock).mockResolvedValue({
            status: 200,
            data: false
        })
        await authController.validateAuthenticated()
            .then(resp => {
                expect(resp).toBe(false)
            })
    })

    test('when backend faild and validate then return false', async () => {
        (axios.get as jest.Mock).mockImplementation(() =>
            Promise.reject("service unavailable")
        )
        await authController.validateAuthenticated()
            .then(resp => {
                expect(resp).toBe(false)
            })
    })

    test('can login', async () => {
        (axios.postForm as jest.Mock).mockResolvedValue({ status: 200 });
        (axios.get as jest.Mock).mockImplementation((path: string) => {
            if (path.includes('user')) {
                return Promise.resolve({ status: 200, data: user });
            } else {
                return Promise.resolve({ status: 200, data: notebookWithNotes });
            }
        })

        await authController.login(user.userName, "secret", true);
        let isDispatchedUser = store.getState().authReducer.isAuth;
        let isDispatchedNote = store.getState().notebooksReducer.notebooks.length > 0;
        expect(isDispatchedUser).toBe(true);
        expect(isDispatchedNote).toBe(true);
    })

    test('return auth error on login failure', async () => {
        (axios.postForm as jest.Mock).mockResolvedValue({ status: 400 })

        await authController.login(user.userName, "secret", true);
        let isDispatchedUser = store.getState().authReducer.isAuth;
        let isDispatchedNote = store.getState().notebooksReducer.notebooks.length > 0;
        expect(isDispatchedUser).toBe(false);
        expect(isDispatchedNote).toBe(false);
    })

    test('can register', async () => {
        (axios.post as jest.Mock).mockResolvedValue({ status: 200, data: { user } })
        await authController.register('test-username', 'Qwertyuio123123!', 'Qwertyuio123123!');
        const authState = store.getState().authReducer;
        expect(authState.isAuth).toBe(true);
        expect(authState.user).toEqual(user);
    })

    test('cant register when passwords doesnt match', async () => {
        await authController.register('test-username', 'Qwertyuio123123!', 'Assdfghjkjl123123!');
        const authState = store.getState().authReducer;
        expect(authState.isAuth).toBe(false);
        expect(authState.user).toBeUndefined();
        expect(authState.validation.isSucceded).toBe(false);
        expect(authState.validation.errors.password).toEqual('Пароли не совпадают');
        expect(authState.validation.errors.confirmPassword).toEqual('Пароли не совпадают');
    })

    test('cant register when password weak', async () => {
        await authController.register('test-username', 'qwer', 'qwer');
        const authState = store.getState().authReducer;
        expect(authState.isAuth).toBe(false);
        expect(authState.user).toBeUndefined();
        expect(authState.validation.isSucceded).toBe(false);
        expect(authState.validation.errors.password).toEqual('Пароль должен быть длинной не менее 8 символов, содержать заглавные и прописные буквы и хотя бы одну цифру');
        expect(authState.validation.errors.confirmPassword).toBeUndefined();
    })

    test('can restore password', async () => {
        (axios.post as jest.Mock).mockResolvedValue({status: 200});
        const errors = await authController.restorePassword(1, 'ABC', 'Qwerty123!');
        expect(errors).toBeNull();
    })

    test('return error when restore password fails', async () => {
        (axios.post as jest.Mock).mockResolvedValue({status: 400, data: 'error occured'});
        const errors = await authController.restorePassword(1, 'ABC', 'Qwerty123!');
        expect(errors).toEqual('error occured');
    })

    test('can upload avatar', async () => {
        (axios.post as jest.Mock).mockResolvedValue({ status: 200 });
        (axios.get as jest.Mock).mockImplementation((path: string) => {
            if (path.includes('user')) {
                return Promise.resolve({ status: 200, data: user });
            } else {
                return Promise.resolve({ status: 200, data: notebookWithNotes });
            }
        });
        await authController.uploadAvatar(new FormData());
        const authState = store.getState().authReducer;
        expect(authState.isAuth).toBeTruthy();
        expect(authState.user).not.toBeNull();
    })

    test('can change password', async () => {
        (axios.post as jest.Mock).mockResolvedValue({ status: 200 });
        (axios.get as jest.Mock).mockImplementation((path: string) => {
            if (path.includes('user')) {
                return Promise.resolve({ status: 200, data: user });
            } else {
                return Promise.resolve({ status: 200, data: notebookWithNotes });
            }
        });
        (axios.patch as jest.Mock).mockResolvedValue({status: 200});
        await authController.register('test-username', 'Qwertyuio123123!', 'Qwertyuio123123!');
        const response = await authController.updateUser({currentPassword: 'Qwertyuio123123!', newPassword: 'Asdfghj123!', newPasswordConfirm: 'Asdfghj123!'});
        expect(response.isSuccessfull).toBe(true);
        expect(response.errors).toEqual({targets: [""], message: ""});
    })

    test('return error when change password fails', async () => {
        (axios.post as jest.Mock).mockResolvedValue({ status: 200 });
        (axios.get as jest.Mock).mockImplementation((path: string) => {
            if (path.includes('user')) {
                return Promise.resolve({ status: 200, data: user });
            } else {
                return Promise.resolve({ status: 200, data: notebookWithNotes });
            }
        });
        (axios.patch as jest.Mock).mockResolvedValue({status: 400, statusText: "invalid state", response: {data: {targets: [], message: "invalid state"}}});
        await authController.register('test-username', 'Qwertyuio123123!', 'Qwertyuio123123!');
        const response = await authController.updateUser({currentPassword: 'Qwertyuio123123!', newPassword: 'Asdfghj123!', newPasswordConfirm: 'Asdfghj123!'});
        expect(response.isSuccessfull).toBe(false);
        expect(response.errors).toEqual({targets: [], message: "invalid state"})
    })
})
