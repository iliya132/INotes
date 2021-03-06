import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import Button from '../../components/Button';
import { Icons } from '../../components/Svg/types';
import authController from '../../controllers/AuthController';
import { ValidationResult } from '../../controllers/types';
import { REG_EXP_VALIDATE_PASSWORD } from '../../Misc/regexp';
import { authErrors, removeAuthErrors } from '../../store/reducers/authReduces';
import { useAppDispatch } from '../../store/store.hooks';
import styles from './register.scss';
import lockSvg from '../../../static/assets/lock.svg';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { Input } from '../../components/Input/Input';
import PasswordInput from '../../components/PasswordInput';

export default function Register() {
    const [validityState, setValidity] = useState({ isSucceded: true, errors: {} } as ValidationResult);
    const dispatch = useAppDispatch();
    const serverErrors = useSelector(authErrors);
    const [isLoading, setLoading] = useState(false);
    const containerRef = useRef(null);
    const location = useLocation();
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
            confirmPassword: HTMLInputElement;
        };
        const username: string = formElements.login.value;
        const password: string = formElements.password.value;
        const confirmPassword: string = formElements.confirmPassword.value;
        const validationResult = validate(username, password, confirmPassword);
        if (validationResult.isSucceded) {
            authController.register(username, password, confirmPassword);
        } else {
            const loginErrors = serverErrors ? serverErrors : validationResult.errors.login;
            const passwordErrors = validationResult.errors.password;
            const confirmPasswordErrors = validationResult.errors.confirmPassword;
            setValidity({
                isSucceded: false,
                errors: { login: loginErrors, password: passwordErrors, confirmPassword: confirmPasswordErrors },
            });
            setLoading(false);
        }
    };

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
                                <Input id='login' icon={Icons.Email} type="email" autocomplete="email" placeholder="??????????..." error={validityState.errors.login}/>
                                <br />
                                <PasswordInput id="password" autocomplete='new-password' placeholder='????????????...' error={validityState.errors.password}/>
                                <br />
                                <PasswordInput id="confirmPassword" autocomplete='new-password' placeholder='?????????????????? ????????????...' error={validityState.errors.confirmPassword}/>
                            </div>
                            <div className={styles['submit-area']}>
                                <Button title="????????????????????????????????????" className={styles['login-btn']} isLoading={isLoading} />
                                <NavLink to={'/login'} className={styles['nav-link']}>
                                    ?????? ???????? ???????????????
                                </NavLink>
                            </div>
                        </form>
                    </CSSTransition>
                </SwitchTransition>
            </div>
        </div>
    );
}

function validate(login: string, password: string, confirmPassword: string): ValidationResult {
    var result: ValidationResult = { isSucceded: true, errors: {} };
    if (!login) {
        result.isSucceded = false;
        result.errors.login = '???????????????????? ?????????????? ??????????';
    }

    if (!password || !confirmPassword) {
        result.isSucceded = false;
        if (!password) {
            result.errors.password = '???????????????????? ?????????????? ????????????';
        } else if (!confirmPassword) {
            result.errors.confirmPassword = '???????? ???? ?????????? ???????? ????????????';
        }
    }

    if (password && password !== confirmPassword) {
        result.isSucceded = false;
        result.errors.password = '???????????? ???? ??????????????????';
        result.errors.confirmPassword = '???????????? ???? ??????????????????';
    }

    if (password && !REG_EXP_VALIDATE_PASSWORD.test(password)) {
        result.isSucceded = false;
        result.errors.password =
            '???????????? ???????????? ???????? ?????????????? ???? ?????????? 8 ????????????????,\r\n?????????????????? ?????????????????? ?? ?????????????????? ?????????? \r\n?? ???????? ???? ???????? ??????????';
    }
    return result;
}
