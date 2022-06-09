import axios from "axios";
import { REG_EXP_VALIDATE_PASSWORD } from "../Misc/regexp";
import { auth, authError, logout, validationError } from "../store/reducers/authReduces";
import { store } from "../store/store";
import { User } from "../store/types";
import BaseController from "./base/BaseController";
import { ValidationResult as ValidationResult } from "./types";

class AuthController extends BaseController {
    private authUrl = this.baseUrl + "auth/";

    public login(username: string, password: string) {
        var formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        axios.postForm(this.authUrl + "login", formData, { withCredentials: true })
            .then(response => {
                if (response.status === 200) {
                    this.getUser();
                } else {
                    store.dispatch(authError(response.data.message))
                }
            })
            // eslint-disable-next-line no-unused-vars
            .catch(_ => {
                store.dispatch(authError("Логин или пароль указаны неверно"))
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
                        store.dispatch(auth(response.data as User))
                    }
                }
            ).catch(reason => {
                store.dispatch(authError(reason.message))
            });
        } else {
            store.dispatch(validationError(validity));
        }
    }

    public getUser() {
        axios.get(this.authUrl + "user", { withCredentials: true })
            .then(response => {
                console.log(response.data)
                store.dispatch(auth(response.data as User))
            }).catch(reason => {
                store.dispatch(authError(reason.message))
            })
    }

    public logout() {
        axios.post(this.authUrl + "logout", null, { withCredentials: true })
            .then(_ => {
                store.dispatch(logout());
            }).catch(reason => {
                console.error(reason.message);
                store.dispatch(logout());
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

