import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { Page } from '../../components/Page/page';
import styles from './home.scss';
import rootStyles from '../../Misc/root.scss';

export default function Home() {
    const navigate = useNavigate();
    return (
        <Page>
            <div className={rootStyles.row}>
                <div className={styles.offer}>
                    <h1 className={styles['offer-header']}>Организуй свои мысли</h1>
                    <div className={styles['offer-text']}>
                        Наведи порядок в своих заметках в удобном интерфейсе INotes
                    </div>
                    <Button title="Войти" className={styles['login-btn']} onClick={() => navigate('/login')} />
                </div>
                <div className={styles['back-img-tree']} />
            </div>
        </Page>
    );
}
