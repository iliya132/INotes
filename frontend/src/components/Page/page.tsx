import React from 'react';
import Header from '../Header';
import styles from './page.scss';
import rootStyles from '../../Misc/root.scss';
import { IPageProps } from './types';

export function Page(props: IPageProps) {
    const { children } = props;
    return (
        <div className={styles.container}>
            <div className={rootStyles.row}>
                <Header />
            </div>
            <div className={rootStyles.row}>{children}</div>
        </div>
    );
}
