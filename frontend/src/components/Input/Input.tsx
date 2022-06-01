import React, { useState } from 'react';
import IInputProps from './types';
import styles from './input.scss';
import Svg from '../Svg';
import { Icons } from '../Svg/types';
import classNames from 'classnames';

export function Input(props: IInputProps) {
    const { type, id, autocomplete, error, className, onChange } = props;
    const [isPasswordShown, setPasswordShown] = useState(false);
    const inputType = type === 'password' && isPasswordShown ? 'text' : type;
    const internalClassName = error ? classNames(styles['input'], styles['input-error'], className) : classNames(styles['input'], className);
    return (
        <>
            <div className={styles['input-container']}>
                <input className={internalClassName} id={id} type={inputType} onChange={onChange} autoComplete={autocomplete}/>
                {inputType == 'password' ? (
                    <Svg
                        icon={Icons.EyeOpened}
                        className={styles['eye-icon']}
                        onClick={() => setPasswordShown(!isPasswordShown)}
                    />
                ) : type === 'password' ? (
                    <Svg
                        icon={Icons.EyeClosed}
                        className={styles['eye-icon']}
                        onClick={() => setPasswordShown(!isPasswordShown)}
                    />
                ) : null}
            </div>
            <label className={styles['error-label']} htmlFor={id}>{error}</label>
        </>
    );
}
