import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import Button from '../../components/Button';
import Svg from '../../components/Svg';
import { Icons } from '../../components/Svg/types';
import authController from '../../controllers/AuthController';
import { ValidationResult } from '../../controllers/types';
import { REG_EXP_VALIDATE_PASSWORD } from '../../Misc/regexp';
import { authErrors, removeAuthErrors } from '../../store/reducers/authReduces';
import { useAppDispatch } from '../../store/store.hooks';
import styles from './register.scss';
import lockSvg from '../../../static/assets/lock.svg';

export default function Register() {
    const [validityState, setValidity] = useState({isSucceded: true, errors: {}} as ValidationResult)
    const dispatch = useAppDispatch();
    const serverErrors = useSelector(authErrors);
    const location = useLocation();
    useEffect(() => {
        dispatch(removeAuthErrors());
    }, [location])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formElements = form.elements as typeof form.elements & {
            login: HTMLInputElement;
            password: HTMLInputElement;
            confirmPassword: HTMLInputElement;
        };
        const username: string = formElements.login.value;
        const password: string = formElements.password.value;
        const confirmPassword: string = formElements.confirmPassword.value;
        const validationResult = validate(username, password, confirmPassword);
        if (validationResult.isSucceded) {
            authController.register(username, password, confirmPassword);
        } else {
            const loginErrors = serverErrors? serverErrors : validationResult.errors.login;
            const passwordErrors = validationResult.errors.password;
            const confirmPasswordErrors = validationResult.errors.confirmPassword;
            setValidity({isSucceded: false, errors: {login: loginErrors, password: passwordErrors, confirmPassword: confirmPasswordErrors}})
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles['column']}>
                <a href="/" className={styles['logo-link']}>
                    <h1 className={styles.logo}>I-Note</h1>
                </a>

                <form action="#" className={styles['centered-container']} onSubmit={handleSubmit}>
                    <div className={styles["login-form"]}>
                        <img src={lockSvg} width="102px" height="102px" className={styles['lock-img']} />
                        <div className={styles['login-input']}>
                            <Svg icon={Icons.Email} className={styles['email-ico']} />
                            <input type="email" autoComplete="email" id="login" placeholder='E-mail...'/>
                        </div>
                        <label className={styles['error-label']} htmlFor="login">
                            {validityState.errors.login}
                        </label>
                        <br />
                        <div className={styles['login-input']}>
                            <Svg icon={Icons.Key} className={styles['email-ico']} />
                            <input type="password" autoComplete="new-password" id="password" placeholder='Password...'/>
                        </div>
                        <label className={styles['error-label']} htmlFor="password">
                            {validityState.errors.password}
                        </label>
                        <br />
                        <div className={styles['login-input']}>
                            <Svg icon={Icons.Key} className={styles['email-ico']} />
                            <input type="password" autoComplete="new-password" id="confirmPassword" placeholder='Confirm password...'/>
                        </div>
                        <label className={styles['error-label']} htmlFor="confirmPassword">
                            {validityState.errors.confirmPassword}
                        </label>

                    </div>
                    <div className={styles['submit-area']}>
                        <div className={styles["oauth-btns"]}>
                            <button className={styles["ya-btn"]}><Svg icon={Icons.YaLogo}/></button>
                            <button className={styles["g-btn"]}><Svg icon={Icons.GoogleLogo}/></button>
                        </div>

                        <Button title="REGISTER" className={styles['login-btn']} />
                        <NavLink to={'/login'} className={styles['nav-link']} >
                            Already have an account?
                        </NavLink>
                    </div>
                </form>
            </div>
        </div>
    );
}

function validate(login: string, password: string, confirmPassword: string): ValidationResult {
    var result: ValidationResult = { isSucceded: true, errors: {} }
    if (!login) {
        result.isSucceded = false;
        result.errors.login = "Необходимо указать логин";
    }

    if (!password || !confirmPassword) {
        result.isSucceded = false;
        if (!password) {
            result.errors.password = "Необходимо указать пароль";
        }else if (!confirmPassword) {
            result.errors.confirmPassword = "Поле не может быть пустым";
        }
    }

    if (password && password !== confirmPassword) {
        result.isSucceded = false;
        result.errors.password = "Пароли не совпадают";
        result.errors.confirmPassword = "Пароли не совпадают";
    }

    if (password && !REG_EXP_VALIDATE_PASSWORD.test(password)) {
        result.isSucceded = false;
        result.errors.password = "Пароль должен быть длинной не менее 8 символов,\r\nсодержать заглавные и прописные буквы \r\nи хотя бы одну цифру";
    }
    return result;
}
