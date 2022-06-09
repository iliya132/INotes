import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import Button from '../../components/Button';
import { Input } from '../../components/Input/Input';
import { Page } from '../../components/Page/page';
import authController from '../../controllers/AuthController';
import { authErrors, removeAuthErrors, validationError, validationErrors } from '../../store/reducers/authReduces';
import { useAppDispatch } from '../../store/store.hooks';
import styles from './login.scss';

export default function Login() {
    const dispatch = useAppDispatch();
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
        };
        let username: string = formElements.login.value;
        let password: string = formElements.password.value;
        if (username && password) {
            authController.login(username, password);
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
    const passwordErrors = errors ? errors : validityErrors.errors?.password ? validityErrors.errors.password : undefined;
    return (
        <Page>
            <div className={styles['centered-container']}>
                <form action="#" className={styles['login-form']} onSubmit={handleSubmit}>
                    <h3 className={classNames(styles['text-centered'], styles['login-header'])}>Вход</h3>
                    <span className={styles['silenced']}>Логин</span>
                    <Input type="text" id="login" autocomplete="email" error={loginErrors} />
                    <br />
                    <span className={styles['silenced']}>Пароль</span>
                    <Input type="password" id="password" autocomplete="current-password" error={passwordErrors} />
                    <Button title="Авторизоваться" className={styles['login-btn']} />
                    <NavLink to={'/register'} className={styles['nav-link']}>
                        Нет аккаунта?
                    </NavLink>
                </form>
            </div>
        </Page>
    );
}
