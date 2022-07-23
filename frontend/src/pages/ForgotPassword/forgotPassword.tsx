import React from 'react';
import { NavLink } from 'react-router-dom';
import Button from '../../components/Button';
import styles from '../RestorePassword/restorePassword.scss';
import lockSvg from '../../../static/assets/lock.svg';
import { Icons } from '../../components/Svg/types';
import Svg from '../../components/Svg';
import authController from '../../controllers/AuthController';
import { toast } from 'react-toastify';

export function ForgotPassword() {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formElements = form.elements as typeof form.elements & {
            email: HTMLInputElement;
        };
        const email = formElements.email.value;
        authController.forgotPassword(email).then((response) => {
            if (response) {
                toast.success('На ваш почтовый адрес было направлено письмо с инструкцией по восстановлению пароля', {autoClose: 10_000});
            } else {
                toast.error('Что-то пошло не так. Попробуйте повторить операцию');
            }
        });
    };
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
                            <input type="email" autoComplete="email" id="email" placeholder="Почта..." />
                        </div>
                        <br/>
                        <div className={styles["help-text"]}>Если вы не помните ваш логин - напишите нам на <a href="mailto:support@i-note.online">support@i-note.online</a> и мы поможем
                            восстановить доступ к аккаунту
                        </div>
                        
                    </div>
                    <div className={styles['submit-area']}>
                        <Button title="Восстановить" className={styles['login-btn']} />
                        <NavLink to={'/login'} className={styles['nav-link']}>
                            Я вспомнил свой пароль!
                        </NavLink>
                    </div>
                </form>
            </div>
        </div>
    );
}
