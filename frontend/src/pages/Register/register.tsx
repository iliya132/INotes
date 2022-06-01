import classNames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';
import Button from '../../components/Button';
import { Input } from '../../components/Input/Input';
import { Page } from '../../components/Page/page';
import styles from './register.scss';

export default function Register() {
    return (
        <Page>
            <div className={styles["centered-container"]}>
                <form action="#" className={styles["register-form"]}>
                    <h3 className={classNames(styles["text-centered"], styles["register-header"])}>Регистрация</h3>
                    <span className={styles["silenced"]}>Email</span>
                    <Input type="email" id="email" autocomplete='email'/>
                    <span className={styles["silenced"]}>Пароль</span>
                    <Input type="password" id="password" autocomplete='new-password'/>
                    <span className={styles["silenced"]}>Повторите пароль</span>
                    <Input type="password" id="repeat-password" autocomplete='new-password'/>
                    <Button title="Зарегистрироваться" className={styles["register-btn"]}/>
                    <NavLink to={"/login"} className={styles["nav-link"]}>Уже есть аккаунт?</NavLink>
                </form>
            </div>
        </Page>
    );
}
