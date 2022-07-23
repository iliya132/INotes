import React, { memo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import styles from './home.scss';

function Home() {
    const navigate = useNavigate();
    return (
        <div className={styles.container}>
            <div className={styles.column}>
                <NavLink to="/" className={styles['logo-link']}>
                    <h1 className={styles.logo}>I-Note</h1>
                </NavLink>
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

export default memo(Home);
