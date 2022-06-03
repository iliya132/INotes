import React from 'react';
import ITooltipProps from './types';
import styles from './tooltip.scss';
import classNames from 'classnames';

export function ToolTip(props: ITooltipProps) {
    const { tooltip, children } = props;
    return (
        <div className={styles['has-tooltip']}>
            {children}
            <span className={classNames(styles['tooltip'], styles["tooltip-without-border"])} role="tooltip">{tooltip}</span>
        </div>
    );
}
