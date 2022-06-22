import classNames from 'classnames';
import React from 'react';
import Svg from '../Svg';
import styles from './SmallButton.scss';
import { IMediumButtonProps } from './types';

export function MediumButton(props: IMediumButtonProps) {
    const { icon, size, className, onClick, title } = props;

    return (
        <div className={classNames(styles["medium-container"], className)} onClick={onClick}>
            <Svg icon={icon} className={styles['small-button-icon']} width={size} height={size} />
            <span>{title}</span>
        </div>
    );
}
