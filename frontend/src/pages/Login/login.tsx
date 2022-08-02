import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import Button from '../../components/Button';
import authController from '../../controllers/AuthController';
import { authErrors, removeAuthErrors, validationError, validationErrors } from '../../store/reducers/authReducer';
import { useAppDispatch } from '../../store/store.hooks';
import styles from './login.scss';
import lockSvg from '../../../static/assets/lock.svg';
import Svg from '../../components/Svg';
import { Icons } from '../../components/Svg/types';
import Checkbox from '../../components/Checkbox';
import properties from '../../properties/properties';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import PasswordInput from '../../components/PasswordInput';
import { Input } from '../../components/Input/Input';

export default function Login() {
    const dispatch = useAppDispatch();
    const hostUrl = properties.apiUrl;
    const location = useLocation();
    const [isLoading, setLoading] = useState(false);
    const containerRef = useRef(null);
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
                <NavLink to="/" className={styles['logo-link']}>
                    <h1 className={styles.logo}>I-Note</h1>
                </NavLink>
                <SwitchTransition mode="out-in">
                    <CSSTransition
                        key={'login'}
                        classNames="fade"
                        timeout={300}
                        appear
                        mountOnEnter={true}
                        unmountOnExit={true}
                        nodeRef={containerRef}>
                        <form
                            action="#"
                            className={styles['centered-container']}
                            onSubmit={handleSubmit}
                            ref={containerRef}>
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
                                    <a className={styles['ya-btn']} href={`${hostUrl}oauth2/authorization/yandex`}>
                                        <Svg icon={Icons.yandexBtn} />
                                    </a>
                                    <a className={styles['g-btn']} href={`${hostUrl}oauth2/authorization/google`}>
                                        <div className={styles['google-btn']}>
                                            <div className={styles['google-icon-wrapper']}>
                                                <img
                                                    className={styles['google-icon-svg']}
                                                    src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                                                />
                                            </div>
                                            <p className={styles['btn-text']}>
                                                <b>Sign in with Google</b>
                                            </p>
                                        </div>
                                    </a>
                                </div>

                                <Button title="Войти" className={styles['login-btn']} isLoading={isLoading} />
                                <NavLink to={'/register'} className={styles['nav-link']}>
                                    Еще нет аккаунта?
                                </NavLink>
                            </div>
                        </form>
                    </CSSTransition>
                </SwitchTransition>
            </div>
        </div>
    );
}
