import classNames from 'classnames';
import React from 'react';
import Svg from '../Svg';
import styles from './SmallButton.scss';
import { ISmallButtonProps } from './types';

export function SmallButton(props: ISmallButtonProps) {
    const { icon, size, className, onClick, tooltip, disabled } = props;

    const handleOnClick = () => {
        if (disabled) {
            return;
        } else if (onClick) {
            onClick();
        }
    };

    return (
        <div
            className={classNames(styles['small-button-container'], className)}
            onClick={handleOnClick}
            title={tooltip}
            data-testid={icon.toString()}>
            <Svg icon={icon} className={styles['small-button-icon']} width={size} height={size} />
        </div>
    );
}
