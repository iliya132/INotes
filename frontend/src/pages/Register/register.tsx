import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import Button from '../../components/Button';
import { Input } from '../../components/Input/Input';
import { Page } from '../../components/Page/page';
import authController from '../../controllers/AuthController';
import { ValidationResult } from '../../controllers/types';
import { REG_EXP_VALIDATE_PASSWORD } from '../../Misc/regexp';
import { authErrors, removeAuthErrors } from '../../store/reducers/authReduces';
import { useAppDispatch } from '../../store/store.hooks';
import styles from './register.scss';

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
        <Page>
            <div className={styles['centered-container']}>
                <form action="#" className={styles['register-form']} onSubmit={handleSubmit}>
                    <h3 className={classNames(styles['text-centered'], styles['register-header'])}>Регистрация</h3>
                    <span className={styles['silenced']}>Email</span>
                    <Input type="email" id="login" autocomplete="email" error={validityState.errors.login}/><br/>
                    <span className={styles['silenced']}>Пароль</span>
                    <Input type="password" id="password" autocomplete="new-password" error={validityState.errors.password}/><br/>
                    <span className={styles['silenced']}>Повторите пароль</span>
                    <Input type="password" id="confirmPassword" autocomplete="new-password" error={validityState.errors.confirmPassword}/>
                    <Button title="Зарегистрироваться" className={styles['register-btn']} />
                    <NavLink to={'/login'} className={styles['nav-link']}>
                        Уже есть аккаунт?
                    </NavLink>
                </form>
            </div>
        </Page>
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
