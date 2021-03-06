import classNames from 'classnames';
import React from 'react';
import Popup from 'reactjs-popup';
import notesController from '../../controllers/NotesController';
import Svg from '../Svg';
import { Icons } from '../Svg/types';
import styles from './note.scss';
import { INoteProps } from './types';

export function Note(props: INoteProps) {
    const { note, isSelected, onClick } = props;
    const { name } = note;


    const handleNoteRemove = () => {
        notesController.removeNote(note.id);
    };

    return (
        <div
            className={
                isSelected
                    ? classNames(styles['note-container'], styles['note-container-selected'])
                    : styles['note-container']
            }
            onClick={onClick}>
            <div className={styles['note-circle-container']}>
                <div className={styles['note-circle']}>
                    <Svg icon={Icons.Circle} width={7} height={7} className={styles['note-circle']}></Svg>
                </div>

                <div className={styles['note-name']}>{name}</div>
            </div>
            <div className={styles['more-actions']}>
                <Popup
                    trigger={
                        <div>
                            <Svg icon={Icons.Dots}></Svg>
                        </div>
                    }>
                    <div className={styles['context-container']}>
                        <ul className={styles['context-container-list']}>
                            <li onClick={handleNoteRemove}>Удалить</li>
                        </ul>
                    </div>
                </Popup>
            </div>
        </div>
    );
}
