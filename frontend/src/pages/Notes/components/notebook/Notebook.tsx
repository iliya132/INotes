import React, { useState } from 'react';
import Svg from '../../../../components/Svg';
import { Icons } from '../../../../components/Svg/types';
import styles from './Notebook.scss';
import { INotebookProps } from './types';
import { allNotes } from '../../../../store/reducers/notebooksReducer';
import { INote, INotebook } from '../../../../store/types';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { useNavigate, useParams } from 'react-router-dom';
import notesController from '../../../../controllers/NotesController';
import { now } from '../../../../Misc/utils/dateUtils';
import Popup from 'reactjs-popup';

export function Notebook(props: INotebookProps) {
    const { notebook } = props;
    const notes = useSelector(allNotes);
    const navigate = useNavigate();
    const urlParams = useParams();
    const selectedNote = Number(urlParams.selectedNote);
    let currentNote: INote | null = null;
    if (selectedNote !== -1) {
        currentNote = notes.filter((it) => it.id === selectedNote)[0];
    }

    const isExpandedDefault = currentNote != null && currentNote.parent.id === notebook.id;

    const [isExpanded, setExpanded] = useState(isExpandedDefault);

    if(isExpandedDefault && isExpanded !== isExpandedDefault){
        setExpanded(true);
    }

    const handleExpandClick = () => {
        setExpanded(!isExpanded);
    };

    const handleNoteSelected = (note: INote) => {
        navigate(`/${note.id}`);
    };

    const handleNewNote = (notebookId: number) => {
        notesController.createNote('Заметка от ' + now(), notebookId);
    };

    const handleDeleteNotebook = (notebook: INotebook) => {
        notesController.removeNotebook(notebook)
    }

    return (
        <div className={styles['notebook-container']}>
            <div className={styles['notebook-row']} onClick={handleExpandClick}>
                <Svg icon={Icons.Notebook} className={styles['notebook-row-notebook-icon']} />
                <span className={styles['notebook-title']}>{notebook.name}</span>
                {isExpanded ? (
                    <div className={styles['expanded']} />
                ) : (
                    <Svg icon={Icons.ArrowDown} className={styles['notebook-row-arrow-down']} />
                )}
                <Popup
                    trigger={
                        <div className={styles['notebook-options-dots']}>
                            <Svg icon={Icons.WhiteDots} />
                        </div>
                    }>
                    {(close) => {
                        return (
                            <div className={styles['notebook-options-popup-container']}>
                                <span>{notebook.name}</span>
                                <hr />
                                <ul>
                                    <li onClick={() => {close(); handleDeleteNotebook(notebook)}}>Удалить</li>
                                </ul>
                            </div>
                        );
                    }}
                </Popup>
            </div>
            {isExpanded ? (
                <div className={styles['notebook-notes']}>
                    {notebook.notes.map((it) => (
                        <div
                            key={'note_nav#' + it.id}
                            className={classNames(
                                styles['notebook-note-container'],
                                currentNote?.id === it.id ? styles['selected'] : undefined,
                            )}
                            onClick={() => handleNoteSelected(it)}>
                            <div className={styles['circle']}></div>
                            <span className={styles['notebook-note-title']}>{it.name}</span>
                        </div>
                    ))}
                    <div className={styles['notebook-note-container']} onClick={() => handleNewNote(notebook.id)}>
                        <div className={styles['circle']}></div>
                        <span className={styles['notebook-note-title']}>Создать новую</span>
                    </div>
                </div>
            ) : undefined}
        </div>
    );
}
