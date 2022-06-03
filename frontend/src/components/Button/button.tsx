import classNames from 'classnames';
import React from 'react';
import styles from './button.scss';
import { IButtonProps } from './types';

export function Button(props: IButtonProps) {
    const { title, className, disabled, onClick } = props;
    return (
        <button className={classNames(styles['primary-button'], className)} disabled={disabled} onClick={onClick}>
            {title}
        </button>
    );
}