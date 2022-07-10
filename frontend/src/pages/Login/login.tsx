import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import Button from '../../components/Button';
import authController from '../../controllers/AuthController';
import { authErrors, removeAuthErrors, validationError, validationErrors } from '../../store/reducers/authReduces';
import { useAppDispatch } from '../../store/store.hooks';
import styles from './login.scss';
import lockSvg from '../../../static/assets/lock.svg';
import Svg from '../../components/Svg';
import { Icons } from '../../components/Svg/types';
import Checkbox from '../../components/Checkbox';

export default function Login() {
    const dispatch = useAppDispatch();
    const location = useLocation();
    useEffect(() => {
        dispatch(removeAuthErrors());
    }, [location]);
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
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
        }
    };
    const errors = useSelector(authErrors);
    const validityErrors = useSelector(validationErrors);
    const loginErrors = errors ? errors : validityErrors.errors?.login ? validityErrors.errors.login : undefined;
    const passwordErrors = errors
        ? errors
        : validityErrors.errors?.password
            ? validityErrors.errors.password
            : undefined;
    return (
        <div className={styles.container}>
            <div className={styles['column']}>
                <a href="/" className={styles['logo-link']}>
                    <h1 className={styles.logo}>I-Note</h1>
                </a>

                <form action="#" className={styles['centered-container']} onSubmit={handleSubmit}>
                    <div className={styles['login-form']}>
                        <img src={lockSvg} width="102px" height="102px" className={styles['lock-img']} />
                        <div className={styles['login-input']}>
                            <Svg icon={Icons.Email} className={styles['email-ico']} />
                            <input type="email" autoComplete="email" id="login" placeholder="E-mail..." />
                        </div>
                        <label className={styles['error-label']} htmlFor="login">
                            {loginErrors}
                        </label>
                        <br />
                        <div className={styles['login-input']}>
                            <Svg icon={Icons.Key} className={styles['email-ico']} />
                            <input type="password" autoComplete="password" id="password" placeholder="Password..." />
                        </div>
                        <label className={styles['error-label']} htmlFor="password">
                            {passwordErrors}
                        </label>
                        <div className={styles['optins-row']}>
                            <div className={styles['forgot-password']}>
                                <NavLink to="#" className={styles['forget-password-link']}>
                                    Forgot your password?
                                </NavLink>
                            </div>
                            <div className={styles['remember-me']}>
                                <Checkbox id="rememberMe" className={styles['remember-me-checkbox']} />
                                <span className={styles['remember-me-title']}>Remember me</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles['submit-area']}>
                        <div className={styles['oauth-btns']}>
                            <button className={styles['ya-btn']}>
                                <Svg icon={Icons.YaLogo} />
                            </button>
                            <button className={styles['g-btn']}>
                                <Svg icon={Icons.GoogleLogo} />
                            </button>
                        </div>

                        <Button title="LOGIN" className={styles['login-btn']} />
                        <NavLink to={'/register'} className={styles['nav-link']}>
                            Want to register?
                        </NavLink>
                    </div>
                </form>
            </div>
        </div>
    );
}
