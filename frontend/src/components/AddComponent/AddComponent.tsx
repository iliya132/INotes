import React from 'react';
import Popup from 'reactjs-popup';
import notesController from '../../controllers/NotesController';
import NotebookPopup from '../NotebooCreatePopup';
import Svg from '../Svg';
import { Icons } from '../Svg/types';
import ToolTip from '../Tooltip';
import styles from './AddComponent.scss';

export function AddComponent() {
    const handleNoteCreate = () => {
        notesController.createNote('Заметка от ' + new Date().toLocaleDateString());
    };

    return (
        <Popup
            trigger={
                <div>
                    <ToolTip tooltip="Добавить...">
                        <Svg icon={Icons.Plus} width={25} height={25} className={styles['plus-icon']} />
                    </ToolTip>
                </div>
            }
            mouseLeaveDelay={300}
            mouseEnterDelay={0}
            arrow={false}
            position="bottom left"
            nested>
            {(close) => {
                return (
                    <div className={styles['add-container']}>
                        <ul className={styles['add-container-list']}>
                            <Popup trigger={<li>Записную книжку</li>} nested position="bottom left">
                                <NotebookPopup afterClick={() => close()} />
                            </Popup>
                            <li
                                onClick={() => {
                                    handleNoteCreate();
                                    close();
                                }}>
                                Заметку
                            </li>
                        </ul>
                    </div>
                );
            }}
        </Popup>
    );
}
