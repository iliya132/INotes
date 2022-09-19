import React from 'react';
import ReactLoading from 'react-loading';
import styles from './loading.scss';

export function Loading() {
    return (
        <div className={styles["loading-container"]}>
            <p>Загрузка. Подождите...</p>
            <ReactLoading type="cylon" color="black" />
        </div>
    )
}
