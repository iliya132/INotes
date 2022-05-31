import React from 'react';
import IInputProps from './types';
import styles from './input.scss';
import Svg from '../Svg';
import { Icons } from '../Svg/types';

export function Input(props: IInputProps) {
    return (
        <>
            <div className={styles['input-container']}>
                <input className={styles['input']} id={props.id} type={props.type} />
                {props.type == 'password' ? <Svg icon={Icons.EyeClosed} className={styles["eye-icon"]}/> : null}
            </div>
            <label className={styles['error-label']} htmlFor={props.id}></label>
        </>
    );
}
