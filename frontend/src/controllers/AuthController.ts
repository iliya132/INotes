import axios from "axios";
import { Dispatch } from "react";
import { REG_EXP_VALIDATE_PASSWORD } from "../Misc/regexp";
import { auth, authError, isLoaded, logout, setIsLoaded, validationError } from "../store/reducers/authReducer";
import { clearNotesState } from "../store/reducers/notebooksReducer";
import { store } from "../store/store";
import { fetchUser } from "../store/thunks/authThunks";
import { fetchNotesThunk, getUserTags } from "../store/thunks/notesThunks";
import { User } from "../store/types";
import BaseController from "./base/BaseController";
import { PasswordChange, PasswordChangeResponse, ValidationResult as ValidationResult } from "./types";

class AuthController extends BaseController {
    private authUrl = this.baseUrl + "auth/";
    private dispatchStore = store.dispatch as typeof store.dispatch | Dispatch<any>

    public login(username: string, password: string, rememberMe: boolean) {
        var formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("remember-me", rememberMe.toString())
        return axios.postForm(this.authUrl + "login", formData, { withCredentials: true })
            .then(response => {
                if (response.status === 200) {
                    this.getUser();
                } else {
                    this.dispatchStore(authError(response.data.message))
                }
            })
            // eslint-disable-next-line no-unused-vars
            .catch(_ => {
                this.dispatchStore(authError("Логин или пароль указаны неверно"))
            });
    }

    public validateAuthenticated(): Promise<Boolean> {
        return axios.get(`${this.authUrl}validate`, { withCredentials: true })
            .then(response => {
                if (response.status === 200) {
                    return response.data as Boolean;
                } else {
                    console.log(response.statusText)
                    return false;
                }

            }).catch(response => {
                console.error(response)
                return false;
            })
    }

    public async register(username: string, password: string, confirmPassword: string) {
        let validity = this.validate(username, password, confirmPassword);
        if (validity.isSucceded) {
            axios.post(this.authUrl + "register", { userName: username, password: password }).then(
                response => {
                    if (response.status === 200) {
                        this.dispatchStore(auth(response.data.user as User))
                    }
                }
            ).catch(reason => {
                this.dispatchStore(authError(reason.message))
            });
        } else {
            this.dispatchStore(validationError(validity));
        }
    }

    public async setLoaded() {
        this.dispatchStore(setIsLoaded(true));
    }

    public forgotPassword(userName: string): Promise<Boolean> {
        return axios.get(`${this.authUrl}forgot-password/${userName}`)
            .then(response => {
                if (response.status === 200) {
                    return true
                } else {
                    return false
                }
                // eslint-disable-next-line no-unused-vars
            }).catch(_ => {
                return false
            })
    }

    public restorePassword(userId: number, verificationCode: string, newPassword: string): Promise<string | null> {
        return axios.post(`${this.authUrl}restore-password/${userId}/${verificationCode}`, newPassword,
            { headers: { 'content-type': 'text/plain' } })
            .then(
                response => {
                    if (response.status === 200) {
                        return null
                    } else {
                        return response.data
                    }
                }
            )
            .catch(e => {
                console.log(e)
                return e.response.data
            })
    }

    public getUser() {
        this.dispatchStore(fetchUser())
        this.dispatchStore(fetchNotesThunk());
        this.dispatchStore(getUserTags());
    }

    public logout() {
        return axios.post(this.authUrl + "logout", null, { withCredentials: true })
            .then(() => {
                this.dispatchStore(logout());
                this.dispatchStore(clearNotesState());
            }).catch(reason => {
                console.error(reason.message);
                this.dispatchStore(logout());
            })
    }

    public uploadAvatar(formData: FormData) {
        return axios.post(this.authUrl + "avatar", formData, { withCredentials: true })
            .then(() => {
                this.getUser()
            }).catch((reason) => {
                console.error(reason);
            })
    }

    private validate(username: string, password: string, confirmPassword: string): ValidationResult {
        var result: ValidationResult = { isSucceded: true, errors: {} }
        if (!username) {
            result.isSucceded = false;
            result.errors.username("Поле не может быть пустым")
        }

        if (!password || !confirmPassword) {
            result.isSucceded = false;
            if (!password) {
                result.errors.password = "Поле не может быть пустым";
            }

            if (!confirmPassword) {
                result.errors.confirmPassword = "Поле не может быть пустым";
            }
        }

        if (password !== confirmPassword) {
            result.isSucceded = false;
            result.errors.password = "Пароли не совпадают";
            result.errors.confirmPassword = "Пароли не совпадают";
        }

        if (!REG_EXP_VALIDATE_PASSWORD.test(password)) {
            result.isSucceded = false;
            result.errors.password = "Пароль должен быть длинной не менее 8 символов, содержать заглавные и прописные буквы и хотя бы одну цифру";
        }
        return result;
    }

    public updateUser(passwordChange: PasswordChange): Promise<PasswordChangeResponse> {
        if (passwordChange.newPassword !== passwordChange.newPasswordConfirm) {
            return Promise.resolve({ isSuccessfull: false, errors: { targets: ["new", "confirm"], message: "Пароли не совпадают" } })
        }
        return axios.patch(`${this.authUrl}change-pass`, passwordChange, { withCredentials: true })
            .then((resp) => {
                if (resp.status === 200) {
                    console.debug("successfully updated password", resp)
                    return Promise.resolve({ isSuccessfull: true, errors: { targets: [""], message: "" } })
                } else {
                    return Promise.reject({response: { isSuccessfull: false, data: {targets: [], message: resp.statusText}}})
                }
            }).catch((reason) => {
                console.error("ERROR:", reason);
                const errors = reason.response.data as { targets: string[], message: string }
                return Promise.resolve({ isSuccessfull: false, errors } as PasswordChangeResponse)
            })
    }
}

const authController = new AuthController();
export default authController;
