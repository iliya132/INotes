import React from 'react';
import { NavLink } from 'react-router-dom';
import Button from '../../components/Button';
import { Input } from '../../components/Input/Input';
import { Page } from '../../components/Page/page';
import styles from './login.scss';

export default function Login() {
    return (
        <Page>
            <div className={styles["centered-container"]}>
                <form action="#" className={styles["login-form"]}>
                    <h3 className={styles["text-centered"]}>Вход</h3>
                    <span className={styles["silenced"]}>Логин</span>
                    <Input type="text" id="login" />
                    <span className={styles["silenced"]}>Пароль</span>
                    <Input type="password" id="password" />
                    <Button title="Авторизоваться" className={styles["login-btn"]}/>
                    <NavLink to={"/register"} className={styles["nav-link"]}>Нет аккаунта?</NavLink>
                </form>
            </div>
        </Page>
    );
}
