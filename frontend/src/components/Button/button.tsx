import classNames from 'classnames';
import React from 'react';
import ReactLoading from 'react-loading';
import styles from './button.scss';
import { IButtonProps } from './types';

export function Button(props: IButtonProps) {
    const { title, className, disabled, onClick, type, isLoading } = props;
    return (
        <button
            className={classNames(styles['primary-button'], className)}
            disabled={disabled}
            onClick={onClick}
            type={type}>
            {title}
            <div className={styles['button-content']}>
                {isLoading ? <ReactLoading type="cylon" color="white" /> : undefined}
            </div>
        </button>
    );
}
