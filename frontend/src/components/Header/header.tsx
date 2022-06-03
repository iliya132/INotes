import React from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import styles from './header.scss';
import { useSelector } from 'react-redux';
import { currentUser, isAuth } from '../../store/reducers/authReduces';

export function Header() {
    const isAuthenticated = useSelector(isAuth);
    const user = useSelector(currentUser);

    return (
        <>
            <div className={styles['header-row']}>
                <ul className={styles['menu-list']}>
                    <li>
                        <NavLink className={styles['nav-link']} to="/">
                            <img src="Favicon.png"></img>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={styles['nav-link']} to="/">
                            Главная
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={styles['nav-link']} to="/getting-started">
                            Начать
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={styles['nav-link']} to="/faq">
                            FAQ
                        </NavLink>
                    </li>
                </ul>
                {isAuthenticated ? (
                    <div className={classNames(styles['profile-info'], styles['nav-link'])}>
                        {user?.email}
                        <div className={styles.avatar}></div>
                    </div>
                ) : (
                    <NavLink to="/login" className={classNames(styles['profile-info'], styles['nav-link'])}>
                        Войти
                    </NavLink>
                )}
            </div>
        </>
    );
}
