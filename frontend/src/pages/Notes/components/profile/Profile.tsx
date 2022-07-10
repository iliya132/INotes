import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Popup from 'reactjs-popup';
import Svg from '../../../../components/Svg';
import { Icons } from '../../../../components/Svg/types';
import authController from '../../../../controllers/AuthController';
import { currentUser } from '../../../../store/reducers/authReduces';
import styles from './Profile.scss';

export function Profile() {
    const user = useSelector(currentUser);
    const avatarUrl = user!.avatarUrl ? user?.avatarUrl : "/avatar.png";

    return (
        <div className={styles['profile-container']}>
            <img src={avatarUrl} className={styles['profile-avatar']} />
            <span className={styles['profile-userame']}>{user?.userName}</span>
            <Popup
                trigger={
                    <div className={styles["profile-arrow-down-container"]}>
                        <Svg icon={Icons.ArrowDown} className={styles['profile-arrow-down']} />
                    </div>
                }
                mouseLeaveDelay={300}
                mouseEnterDelay={0}
                arrow={false}
                position="bottom left">
                <div className={styles['context-field']}>
                    <div className={styles['profile-context-header']}>Профиль</div>
                    <hr/>
                    <div className={styles['profile-context-option']}>
                        <NavLink to={'/profile'}> Редактировать </NavLink>
                    </div>
                    <div className={styles['profile-context-option']} onClick={()=>authController.logout()}>
                        Выйти
                    </div>
                </div>
            </Popup>
        </div>
    );
}
