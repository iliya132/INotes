import React from 'react';
import { IPrettyMarkupProps } from './types';
import styles from './PrettyMarkup.scss';

export function PrettyMarkup(props: IPrettyMarkupProps) {
    const { renderedValue } = props;
    return (
        <div
            className={styles['workfield-content-display-field']}
            dangerouslySetInnerHTML={{ __html: renderedValue }}></div>
    );
}
