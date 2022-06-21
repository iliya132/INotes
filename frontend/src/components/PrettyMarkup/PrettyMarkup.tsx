import React from 'react';
import { IPrettyMarkupProps } from './types';
import styles from './PrettyMarkup.scss';
import classNames from 'classnames';

export function PrettyMarkup(props: IPrettyMarkupProps) {
    const { renderedValue, className } = props;
    return (
        <div
            className={classNames(styles['workfield-content-display-field'], className)}
            dangerouslySetInnerHTML={{ __html: renderedValue }}></div>
    );
}
