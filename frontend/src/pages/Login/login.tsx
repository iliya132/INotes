import classNames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';
import Button from '../../components/Button';
import { Input } from '../../components/Input/Input';
import { Page } from '../../components/Page/page';
import authController from '../../controllers/AuthController';
import styles from './login.scss';

export default function Login() {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let username: string = event.target[0].value;
        let password: string = event.target[1].value;
        authController.login(username, password);
    }
    return (
        <Page>
            <div className={styles["centered-container"]}>
                <form action="#" className={styles["login-form"]} onSubmit={handleSubmit}>
                    <h3 className={classNames(styles["text-centered"], styles["login-header"])}>Вход</h3>
                    <span className={styles["silenced"]}>Логин</span>
                    <Input type="text" id="login" autocomplete='email' />
                    <span className={styles["silenced"]}>Пароль</span>
                    <Input type="password" id="password" autocomplete='current-password' />
                    <Button title="Авторизоваться" className={styles["login-btn"]} />
                    <NavLink to={"/register"} className={styles["nav-link"]}>Нет аккаунта?</NavLink>
                </form>
            </div>
        </Page>
    );
}
