import React, { useState } from 'react';
import Button from '../Button';
import { IFormInputProps } from './types';
import styles from './NotebookCreatePopup.scss';
import { Input } from '../Input/Input';
import notesController from '../../controllers/NotesController';

export function NotebookPopup(props: IFormInputProps) {
    const { afterClick } = props;
    const [value, setValue] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const handleSubmit = () => {
        notesController.createNotebook(value);
        afterClick();
    };

    return (
        <div className={styles['notebook-create-popup-container']}>
            <Input
                type={'text'}
                id="notebook-name"
                placeholder="Введите имя для новой записной книжки"
                onChange={handleChange}
                data-testid="test-id"
            />
            <Button title="Создать" className={styles['notebook-create-btn']} onClick={handleSubmit} data-testid="test-btn-id"/>
        </div>
    );
}
