import classNames from 'classnames';
import React from 'react';
import Svg from '../Svg';
import styles from './SmallButton.scss';
import { ISmallButtonProps } from './types';

export function SmallButton(props: ISmallButtonProps) {
    const { icon, size, className, onClick, tooltip } = props;

    return (
        <div className={classNames(styles['small-button-container'], className)} onClick={onClick} title={tooltip}>
            <Svg icon={icon} className={styles['small-button-icon']} width={size} height={size} />
        </div>
    );
}
