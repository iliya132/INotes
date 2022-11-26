import React from 'react';
import Svg from '../../../../components/Svg';
import { Icons } from '../../../../components/Svg/types';
import styles from './Notebook.scss';
import { INotebookProps } from './types';
import { allNotes, updateNotebook } from '../../../../store/reducers/notebooksReducer';
import { INote, INotebook } from '../../../../store/types';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { useNavigate, useParams } from 'react-router-dom';
import notesController from '../../../../controllers/NotesController';
import { now } from '../../../../Misc/utils/dateUtils';
import Popup from 'reactjs-popup';
import { useAppDispatch } from '../../../../store/store.hooks';
import Expander from '../../../Expander';

export function Notebook(props: INotebookProps) {
    const { notebook } = props;
    const isExpanded = notebook.isExpanded;
    const notes = useSelector(allNotes);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const urlParams = useParams();
    const selectedNote = Number(urlParams.selectedNote);
    let currentNote: INote | null = null;
    if (selectedNote !== -1) {
        currentNote = notes.filter((it) => it.id === selectedNote)[0];
    }

    const handleNoteSelected = (note: INote) => {
        navigate(`/${note.id}`);
    };

    const handleNewNote = (notebookId: number) => {
        notesController.createNote('Заметка от ' + now(), notebookId);
    };

    const handleDeleteNotebook = (notebook: INotebook) => {
        notesController.removeNotebook(notebook);
    };

    const handleExpanderClick = () => {
        dispatch(updateNotebook({ ...notebook, isExpanded: !isExpanded }))
    }

    return (
        <div className={styles['notebook-container']}>
            <Expander
                isExpanded={isExpanded}
                onClick={handleExpanderClick}
                expanderBody={
                    <div className={styles['notebook-row']}>
                        <Svg icon={Icons.Notebook} className={styles['notebook-row-notebook-icon']} />
                        <span className={styles['notebook-title']}>{notebook.name}</span>
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
                                            <li
                                                onClick={() => {
                                                    close();
                                                    handleDeleteNotebook(notebook);
                                                }}>
                                                Удалить
                                            </li>
                                        </ul>
                                    </div>
                                );
                            }}
                        </Popup>
                    </div>
                }>
                <div className={styles['notebook-notes']}>
                    {notebook.notes
                        .sort((first, second) => first.name.localeCompare(second.name))
                        .map((it) => (
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
            </Expander>
        </div>
    );
}
