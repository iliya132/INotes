import React from 'react';
import IInputProps from './types';
import styles from '../PasswordInput/passwordInput.scss';
import Svg from '../Svg';
import classNames from 'classnames';

export function Input(props: IInputProps) {
    const { id, error, type, icon, autocomplete, className, onChange, placeholder, name } = props;
    const internalClassName = error
        ? classNames(styles['input'], styles['input-error'], className)
        : classNames(styles['input'], className);
    return (
        <>
            <div className={styles['input-container']}>
                {icon ? <Svg icon={icon} className={styles['pre-icon']} /> : undefined}
                <input
                    className={internalClassName}
                    id={id}
                    name={name}
                    type={type}
                    onChange={onChange}
                    autoComplete={autocomplete}
                    placeholder={placeholder}
                />
            </div>
            <label className={styles['error-label']} htmlFor={id}>
                {error}
            </label>
        </>
    );
}