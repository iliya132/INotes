import axios from "axios";
import { Dispatch } from "react";
import { REG_EXP_VALIDATE_PASSWORD } from "../Misc/regexp";
import { auth, authError, logout, validationError } from "../store/reducers/authReduces";
import { store } from "../store/store";
import { fetchUser } from "../store/thunks/authThunks";
import { fetchNotesThunk } from "../store/thunks/notesThunks";
import { User } from "../store/types";
import BaseController from "./base/BaseController";
import { ValidationResult as ValidationResult } from "./types";

class AuthController extends BaseController {
    private authUrl = this.baseUrl + "auth/";
    private dispatchStore = store.dispatch as typeof store.dispatch | Dispatch<any>

    public login(username: string, password: string) {
        var formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
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

    public register(username: string, password: string, confirmPassword: string) {
        let validity = this.validate(username, password, confirmPassword);
        if (validity.isSucceded) {
            let formData = new FormData();
            formData.append("userName", username);
            formData.append("password", password);
            axios.postForm(this.authUrl + "register", formData).then(
                response => {
                    if (response.status === 200) {
                        this.dispatchStore(auth(response.data as User))
                    }
                }
            ).catch(reason => {
                this.dispatchStore(authError(reason.message))
            });
        } else {
            this.dispatchStore(validationError(validity));
        }
    }

    public getUser() {
        this.dispatchStore(fetchUser())
        this.dispatchStore(fetchNotesThunk());
    }

    public logout() {
        return axios.post(this.authUrl + "logout", null, { withCredentials: true })
            .then(() => {
                this.dispatchStore(logout());
            }).catch(reason => {
                console.error(reason.message);
                this.dispatchStore(logout());
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
            result.errors.password = "Пароли не совпадают";
            result.errors.confirmPassword = "Пароли не совпадают";
        }

        if (!REG_EXP_VALIDATE_PASSWORD.test(password)) {
            result.errors.password = "Пароль должен быть длинной не менее 8 символов, содержать заглавные и прописные буквы и хотя бы одну цифру";
        }
        return result;
    }
}

const authController = new AuthController();
export default authController;
