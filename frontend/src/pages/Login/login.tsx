import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, NavLink, useLocation } from 'react-router-dom';
import Button from '../../components/Button';
import authController from '../../controllers/AuthController';
import { authErrors, isAuth, removeAuthErrors, validationError, validationErrors } from '../../store/reducers/authReducer';
import { useAppDispatch } from '../../store/store.hooks';
import styles from './login.scss';
import lockSvg from '../../../static/assets/lock.svg';
import Svg from '../../components/Svg';
import { Icons } from '../../components/Svg/types';
import Checkbox from '../../components/Checkbox';
import properties from '../../properties/properties';
import PasswordInput from '../../components/PasswordInput';
import { Input } from '../../components/Input/Input';
import InputPage from '../Shared/InputPage';
import { REDIRECT_URL } from '../../Misc/constant';

export default function Login() {
    const authenticated = useSelector(isAuth);
    const isSignedIn = authenticated === undefined ? false : authenticated;
    const dispatch = useAppDispatch();
    const hostUrl = properties.apiUrl;
    const location = useLocation();
    const locationState = (location.state as { redirectTo: string })
    const redirectUrl = localStorage.getItem(REDIRECT_URL) || locationState?.redirectTo || "/"
    const [isLoading, setLoading] = useState(false);
    useEffect(() => {
        dispatch(removeAuthErrors());
    }, [location]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const form = event.currentTarget;
        const formElements = form.elements as typeof form.elements & {
            login: HTMLInputElement;
            password: HTMLInputElement;
            rememberMe: HTMLInputElement;
        };
        let username: string = formElements.login.value;
        let password: string = formElements.password.value;
        let rememberMe: boolean = formElements.rememberMe.checked;
        if (username && password) {
            authController.login(username, password, rememberMe);
        } else {
            dispatch(
                validationError({
                    isSucceded: false,
                    errors: {
                        login: !username ? 'Необходимо указать логин' : undefined,
                        password: !password ? 'Необходимо указать пароль' : undefined,
                    },
                }),
            );
            setLoading(false);
        }
    };

    const handleOauth = (url: string) => {
        localStorage.setItem(REDIRECT_URL, redirectUrl)
        document.location.replace(url)
    }

    const handleYandexOauth = () => {
        handleOauth(`${hostUrl}oauth2/authorization/yandex`)
    }

    const handleGoogleOauth = () => {
        handleOauth(`${hostUrl}oauth2/authorization/google`)
    }

    const errors = useSelector(authErrors);
    const validityErrors = useSelector(validationErrors);
    const loginErrors = errors ? errors : validityErrors.errors?.login ? validityErrors.errors.login : undefined;
    const passwordErrors = errors
        ? errors
        : validityErrors.errors?.password
            ? validityErrors.errors.password
            : undefined;
    return isSignedIn ? <Navigate to={redirectUrl} /> : (
        <InputPage>
            <form
                action="#"
                className={styles['centered-container']}
                onSubmit={handleSubmit}>
                <div className={styles['login-form']}>
                    <img src={lockSvg} width="102px" height="102px" className={styles['lock-img']} />
                    <Input
                        type={'email'}
                        icon={Icons.Email}
                        autocomplete="email"
                        placeholder="Почта..."
                        id="login"
                        error={loginErrors}
                    />
                    <br />
                    <PasswordInput
                        id="password"
                        autocomplete="password"
                        error={passwordErrors}
                        placeholder="Пароль..."
                    />
                    <div className={styles['optins-row']}>
                        <div className={styles['forgot-password']}>
                            <NavLink to="/forgot-password" className={styles['forget-password-link']}>
                                Забыли свой пароль?
                            </NavLink>
                        </div>
                        <div className={styles['remember-me']}>
                            <Checkbox id="rememberMe" className={styles['remember-me-checkbox']} />
                            <span className={styles['remember-me-title']}>Запомнить меня</span>
                        </div>
                    </div>
                </div>
                <div className={styles['submit-area']}>
                    <div className={styles['oauth-btns']}>
                        <button className={styles['ya-btn']} onClick={handleYandexOauth} type="button">
                            <Svg icon={Icons.yandexBtn} />
                        </button>
                        <button className={styles['g-btn']} onClick={handleGoogleOauth} type="button">
                            <div className={styles['google-btn']}>
                                <div className={styles['google-icon-wrapper']}>
                                    <img
                                        className={styles['google-icon-svg']}
                                        crossOrigin='anonymous'
                                        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                                    />
                                </div>
                                <p className={styles['btn-text']}>
                                    <b>Sign in with Google</b>
                                </p>
                            </div>
                        </button>
                    </div>

                    <Button title="Войти" className={styles['login-btn']} isLoading={isLoading} />
                    <NavLink to={'/register'} className={styles['nav-link']}>
                        Еще нет аккаунта?
                    </NavLink>
                </div>
            </form>
        </InputPage>
    );
}
