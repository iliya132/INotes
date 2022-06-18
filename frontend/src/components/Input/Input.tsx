import React, { useState } from 'react';
import IInputProps from './types';
import styles from './input.scss';
import Svg from '../Svg';
import { Icons } from '../Svg/types';
import classNames from 'classnames';

export function Input(props: IInputProps) {
    const { type, id, autocomplete, error, className, onChange, placeholder, defaultValue, accept, name } = props;
    const [isPasswordShown, setPasswordShown] = useState(false);
    const inputType = type === 'password' && isPasswordShown ? 'text' : type;
    const internalClassName = error
        ? classNames(styles['input'], styles['input-error'], className)
        : classNames(styles['input'], className);
    return (
        <>
            <div
                className={
                    type === 'password' ? styles['input-container'] : styles['input-container-without-img']
                }>
                <input
                    className={internalClassName}
                    id={id}
                    accept={accept}
                    name={name}
                    type={inputType}
                    onChange={onChange}
                    autoComplete={autocomplete}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                />
                {GetIcon(inputType, type === 'password', () => setPasswordShown(!isPasswordShown))}
            </div>
            <label className={styles['error-label']} htmlFor={id}>
                {error}
            </label>
        </>
    );
}

function GetIcon(inputType: string, isForced: boolean, onclick: () => void) {
    return (
        <>
            {inputType === 'password' ? (
                <Svg icon={Icons.EyeOpened} className={styles['eye-icon']} onClick={onclick} />
            ) : isForced ? (
                <Svg icon={Icons.EyeClosed} className={styles['eye-icon']} onClick={onclick} />
            ) : null}
        </>
    );
}
