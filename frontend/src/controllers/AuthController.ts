import axios from "axios";
import { REG_EXP_VALIDATE_PASSWORD } from "../Misc/regexp";
import { auth, authError, validationError } from "../store/reducers/authReduces";
import { useAppDispatch } from "../store/store.hooks";
import { User } from "../store/types";
import BaseController from "./base/BaseController";
import { ValidationResult as ValidationResult } from "./types";

class AuthController extends BaseController {
    private authUrl = this.baseUrl + "auth/";
    private dispatch = useAppDispatch();

    public login(username: string, password: string) {
        var formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        axios.postForm(this.authUrl + "login", formData)
            .then(response => {
                if (response.status !== 200) {
                    this.dispatch(auth(response.data as User))
                } else {
                    this.dispatch(authError(response.statusText))
                }
            });
    }

    public register(username: string, password: string, confirmPassword: string) {
        let validity = this.validate(username, password, confirmPassword);
        if (validity.isSucceded) {
            let formData = new FormData();
            formData.append("username", username);
            formData.append("password", password);
            axios.postForm(this.authUrl + "register", formData).then(
                response => {
                    if (response.status !== 200) {
                        this.dispatch(auth(response.data as User))
                    } else {
                        this.dispatch(authError(response.statusText))
                    }
                }
            );
        } else {
            this.dispatch(validationError(validity));
        }
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

