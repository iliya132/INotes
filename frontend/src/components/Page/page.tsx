import React from 'react';
import Header from '../Header';
import styles from './page.scss';
import rootStyles from '../../Misc/root.scss';
import { IPageProps } from './types';
import classNames from 'classnames';

export function Page(props: IPageProps) {
    const { children, isFullWidth } = props;
    return (
        <div className={isFullWidth ? styles['container-full'] : styles.container}>
            <div className={styles["header-container"]}>
                <div className={rootStyles.row}>
                    <Header />
                </div>
            </div>

            <div className={classNames(styles.content)}>{children}</div>
        </div>
    );
}
