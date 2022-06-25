import React from 'react';
import styles from './NotFound.scss';

export function NotFound() {
    return (
        <div className={styles['container']}>
            <h2>Страница, которую вы ищете не существует</h2>
            <div className={styles['message']}>Убедитесь что адрес указан верно</div>
            <div className={styles['error-code']}>404</div>
            <div className={styles['back-link-container']}>
                <a href="/" className={styles['back-link']}>
                    Вернуться на сайт
                </a>
            </div>
        </div>
    );
}
