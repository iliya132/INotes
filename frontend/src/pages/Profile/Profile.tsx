import classNames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import Button from '../../components/Button';
import { Input } from '../../components/Input/Input';
import { Page } from '../../components/Page/page';
import { validationErrors } from '../../store/reducers/authReduces';
import styles from './Profile.scss';
import { IProfileProps } from './types';
import avatarImg from '../../../static/assets/avatar.png';
import { useNavigate } from 'react-router-dom';
import authController from '../../controllers/AuthController';

export function Profile(props: IProfileProps) {
    const { user } = props;
    const navigate = useNavigate();
    const validityErrors = useSelector(validationErrors);
    const passwordErrors = validityErrors.errors?.password ? validityErrors.errors.password : undefined;
    const handleSubmit = () => {};
    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('uploading!');
        const file: File = event!.target!.files![0];
        console.log(file);
        const formData = new FormData();
        formData.append('avatar', file, file.name);
        authController.uploadAvatar(formData);
    };
    const avatar = user.avatar ? `data:image/jpeg;base64,${user.avatar}` : avatarImg;

    return (
        <Page>
            <div className={styles['centered-container']}>
                <form action="#" className={styles['profile-form']} onSubmit={handleSubmit}>
                    <h3 className={classNames(styles['text-centered'], styles['login-header'])}>Профиль</h3>
                    <span className={classNames(styles['user-name'], styles['centered'])}>{user.userName}</span>
                    <br />
                    <img src={avatar} className={styles['avatar-img']} />
                    <div className={styles["avatar-container"]}>
                        <label htmlFor="avatar-upload" className={styles["avatar-upload-label"]}>
                            Загрузить аватар
                        </label>
                        <input type="file" id="avatar-upload" onChange={handleAvatarChange} className={styles['avatar-input']} />
                    </div>
                    
                    
                    
                    <h3 className={styles['centered']}>Смена пароля</h3>
                    <span className={styles['silenced']}>Пароль</span>
                    <Input type="password" id="password" autocomplete="current-password" error={passwordErrors} />
                    <span className={styles['silenced']}>Новый пароль</span>
                    <Input type="password" id="new-password" autocomplete="new-password" error={passwordErrors} />
                    <span className={styles['silenced']}>Повторите новый пароль</span>
                    <Input
                        type="password"
                        id="confirm-new-password"
                        autocomplete="new-password"
                        error={passwordErrors}
                    />
                    <Button title="Сохранить изменения" className={styles['save-btn']} />
                    <Button
                        title="Назад"
                        className={styles['cancel-btn']}
                        onClick={() => navigate('/')}
                        type="button"
                    />
                </form>
            </div>
        </Page>
    );
}
