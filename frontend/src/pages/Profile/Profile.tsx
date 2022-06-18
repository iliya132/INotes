import classNames from 'classnames';
import React, { useState } from 'react';
import Button from '../../components/Button';
import { Input } from '../../components/Input/Input';
import { Page } from '../../components/Page/page';
import styles from './Profile.scss';
import { IProfileProps } from './types';
import avatarImg from '../../../static/assets/avatar.png';
import { useNavigate } from 'react-router-dom';
import authController from '../../controllers/AuthController';
import properties from '../../properties/properties';
import { PasswordChange, PasswordChangeResponse } from '../../controllers/types';

export function Profile(props: IProfileProps) {
    const { user } = props;
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({} as PasswordChange);
    const [errors, setErrors] = useState({isSuccessfull: true, errors: {targets: [""], message:""}} as PasswordChangeResponse)
    const oldPassErrors = errors.isSuccessfull ? "" : errors.errors.targets.includes("old") ? errors.errors.message : ""
    const newPassErrors = errors.isSuccessfull ? "" : errors.errors.targets.includes("new") ? errors.errors.message : ""
    const confirmPassErrors = errors.isSuccessfull ? "" : errors.errors.targets.includes("confirm") ? errors.errors.message : ""

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        authController.updateUser(inputs).then((resp) => {
            if (resp.isSuccessfull) {
                navigate('/');
            } else {
                setErrors(resp)
            }
        });
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setInputs({ ...inputs, [name]: value });
    };
    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file: File = event!.target!.files![0];
        if (file.size > properties.maxFileSize) {
            alert('Максимальный размер загружаемого файла - 30 Мб');
            //TODO сжимать файл и показывать нормальные уведомления
            return;
        }
        const formData = new FormData();
        formData.append('avatar', file, file.name);
        authController.uploadAvatar(formData);
    };
    const avatar = user.avatarUrl ? `${user.avatarUrl}` : avatarImg;

    return (
        <Page>
            <div className={styles['centered-container']}>
                <h3 className={classNames(styles['text-centered'], styles['login-header'])}>Профиль</h3>
                <span className={classNames(styles['user-name'], styles['centered'])}>{user.userName}</span>
                <br />
                <img src={avatar} className={styles['avatar-img']}/>
                <div className={styles['avatar-container']}>
                    <label htmlFor="avatar-upload" className={styles['avatar-upload-label']}>
                        Сменить аватар
                    </label>
                    <input
                        type="file"
                        id="avatar-upload"
                        onChange={handleAvatarChange}
                        className={styles['avatar-input']}
                        accept="image/*"
                    />
                </div>

                <form action="#" className={styles['profile-form']} onSubmit={handleSubmit}>
                    <h3 className={styles['centered']}>Смена пароля</h3>
                    <span className={styles['silenced']}>Текущий пароль</span>
                    <Input
                        type="password"
                        id="password"
                        autocomplete="current-password"
                        error={oldPassErrors}
                        onChange={handlePasswordChange}
                        name="currentPassword"
                    />
                    <span className={styles['silenced']}>Новый пароль</span>
                    <Input
                        type="password"
                        id="new-password"
                        autocomplete="new-password"
                        error={newPassErrors}
                        onChange={handlePasswordChange}
                        name="newPassword"
                    />
                    <span className={styles['silenced']}>Повторите новый пароль</span>
                    <Input
                        type="password"
                        id="confirm-new-password"
                        autocomplete="new-password"
                        error={confirmPassErrors}
                        onChange={handlePasswordChange}
                        name="newPasswordConfirm"
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
