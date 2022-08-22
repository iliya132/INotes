import React, { useState } from 'react';
import IInputProps from './types';
import styles from './passwordInput.scss';
import Svg from '../Svg';
import { Icons } from '../Svg/types';
import classNames from 'classnames';

export function PasswordInput(props: IInputProps) {
    const { id, error, autocomplete, className, onChange, placeholder, name } = props;
    const [isPasswordShown, setPasswordShown] = useState(false);
    const inputType = isPasswordShown ? 'text' : 'password';
    const internalClassName = error
        ? classNames(styles['input'], styles['input-error'], className)
        : classNames(styles['input'], className);
    return (
        <>
            <div className={styles['input-container']}>
                <Svg icon={Icons.Key} className={styles['pre-icon']} />
                <input
                    className={internalClassName}
                    id={id}
                    name={name}
                    type={inputType}
                    onChange={onChange}
                    autoComplete={autocomplete}
                    placeholder={placeholder}
                />
                {GetIcon(isPasswordShown, () => setPasswordShown(!isPasswordShown))}
            </div>
            <label className={styles['error-label']} htmlFor={id}>
                {error}
            </label>
        </>
    );
}

function GetIcon(showPassword: boolean, onclick: () => void) {
    return (
        <>
            {showPassword ? (
                <Svg icon={Icons.EyeClosed} className={styles['eye-icon']} onClick={onclick} />
            ) : (
                <Svg icon={Icons.EyeOpened} className={styles['eye-icon']} onClick={onclick} />
            )}
        </>
    );
}
