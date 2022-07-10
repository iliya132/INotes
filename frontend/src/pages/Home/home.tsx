import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import styles from './home.scss';

export default function Home() {
    const navigate = useNavigate();
    return (
        <div className={styles.container}>
            <div className={styles.column}>
                <a href="/" className={styles["logo-link"]}><h1 className={styles.logo}>I-Note</h1></a>
                <div className={styles.offer}>
                    <h1 className={styles['offer-header']}>Организуй свои мысли</h1>
                    <div className={styles['offer-text']}>
                        Наведи порядок в своих заметках в удобном интерфейсе INotes
                    </div>
                    <Button title="Войти" className={styles['login-btn']} onClick={() => navigate('/login')} />
                </div>
            </div>
        </div>
    );
}
