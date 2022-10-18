import React, { useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import styles from './restorePassword.scss';
import lockSvg from '../../../static/assets/lock.svg';
import { Icons } from '../../components/Svg/types';
import authController from '../../controllers/AuthController';
import { REG_EXP_VALIDATE_PASSWORD } from '../../Misc/regexp';
import { toast } from 'react-toastify';
import PasswordInput from '../../components/PasswordInput';
import InputPage from '../Shared/InputPage';

export function RestorePassword() {
    const { userId, verificationCode } = useParams();
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const isUserIdIsNaN = isNaN(Number(userId));
        if (verificationCode === undefined || isUserIdIsNaN) {
            setError('Что-то пошло не так. Попробуйте запросить восстановление пароля еще раз');
            return;
        }

        const form = event.currentTarget;
        const formElements = form.elements as typeof form.elements & {
            password: HTMLInputElement;
        };
        const password = formElements.password.value;
        const validationError = validatePassword(password);
        if (validationError !== null) {
            setError(validationError);
            return;
        }
        authController.restorePassword(Number(userId), verificationCode!, password).then((response) => {
            if (response === null) {
                toast.success('Пароль был успешно изменен');
                navigate('/login');
            } else {
                setError(response);
            }
        });
    };
    return (
        <InputPage>
            <form action="#" className={styles['centered-container']} onSubmit={handleSubmit}>
                <div className={styles['login-form']}>
                    <img src={lockSvg} width="102px" height="102px" className={styles['lock-img']} />
                    <h4 className={styles["header"]}>Восстановление пароля</h4>
                    <PasswordInput
                        autocomplete="new-password"
                        id="password"
                        placeholder="Введите новый пароль"
                    />
                    <label className={styles['error-label']} htmlFor="login">
                        {error}
                    </label>
                </div>
                <div className={styles['submit-area']}>
                    <Button title="Сохранить" className={styles['login-btn']} />
                    <NavLink to={'/login'} className={styles['nav-link']}>
                        Я вспомнил свой пароль!
                    </NavLink>
                </div>
            </form>
        </InputPage>
    );
}

function validatePassword(password: string): string | null {
    if (password && !REG_EXP_VALIDATE_PASSWORD.test(password)) {
        return 'Пароль должен быть длинной не менее 8 символов,\r\nсодержать заглавные и прописные буквы \r\nи хотя бы одну цифру';
    }
    return null;
}
