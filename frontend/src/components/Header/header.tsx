import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import styles from './header.scss';
import { useSelector } from 'react-redux';
import { currentUser, isAuth } from '../../store/reducers/authReduces';
import Popup from 'reactjs-popup';
import authController from '../../controllers/AuthController';
import avatarImg from '../../../static/assets/avatar.png';
import { Search } from '../Search/search';

export function Header() {
    const isAuthenticated = useSelector(isAuth);
    const user = useSelector(currentUser);
    const [contextVisible, setContextVisible] = useState(false);

    const avatar = user?.avatarUrl ? `${user.avatarUrl}` : avatarImg;

    const handleLogout = () => {
        authController.logout();
    };

    return (
        <>
            <div className={styles['header-row']}>
                <ul className={styles['menu-list']}>
                    <li>
                        <NavLink className={styles['nav-link']} to="/">
                            <img src="/Favicon.png"></img>
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
                    <li className={styles["search-element"]}>
                        <Search />
                    </li>
                </ul>
                {isAuthenticated ? (
                    <div
                        className={classNames(styles['profile-info'], styles['nav-link'])}
                        onClick={(e) => {
                            setContextVisible(!contextVisible);
                            e.stopPropagation();
                        }}>
                        <Popup
                            trigger={
                                <div className={styles['popup-container']}>
                                    <div className={styles['user-name-link']}>{user?.userName}</div>
                                    <img src={avatar} className={styles['avatar-img']} />
                                </div>
                            }
                            mouseLeaveDelay={300}
                            mouseEnterDelay={0}
                            arrow={false}
                            position="bottom left">
                            <div className={styles['context-field']}>
                                <div className={styles['profile-context-header']}>Профиль</div>
                                <div className={styles['profile-context-option']}>
                                    <NavLink to={'/profile'}> Редактировать </NavLink>
                                </div>
                                <div className={styles['profile-context-option']} onClick={handleLogout}>
                                    Выйти
                                </div>
                            </div>
                        </Popup>
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
