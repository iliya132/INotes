import React, { useEffect, useState } from 'react';
import styles from './notes.scss';
import Workfield from '../../components/WorkField';
import Profile from './components/profile';
import { Search } from '../../components/Search/search';
import { useSelector } from 'react-redux';
import { allNotes, notebooks } from '../../store/reducers/notebooksReducer';
import { Notebook } from './components/notebook/Notebook';
import { INote, INotebookWithNotes } from '../../store/types';
import { NavLink, useParams } from 'react-router-dom';
import Svg from '../../components/Svg';
import { Icons } from '../../components/Svg/types';
import NotebookPopup from '../../components/NotebookCreatePopup';
import Popup from 'reactjs-popup';

export function NotesPage() {
    const notebooksArr = useSelector(notebooks);
    const notes = useSelector(allNotes);
    const [isContextChanged, setContextChanged] = useState(false);

    const urlParams = useParams();
    const selectedNote = Number(urlParams.selectedNote);
    let currentNote: INote | null = null;
    if (selectedNote !== -1) {
        currentNote = notes.filter((it) => it.id === selectedNote)[0];
    }

    useEffect(() => {
        window.onbeforeunload = function () {
            if (isContextChanged) {
                return 'Вы не сохранили внесенные изменения. Если вы перейдете на другую страницу они будут потеряны';
            }
        };
        return function cleanup() {
            window.onbeforeunload = null;
        };
    });

    const handleNoteChange = () => {
        setContextChanged(true);
    };

    const handleNoteSave = () => {
        setContextChanged(false);
    };

    const notebooksWithNotes = notebooksArr.map((it) => {
        return {
            id: it.id,
            name: it.name,
            color: it.color,
            notes: notes.filter((note) => note.parent.id === it.id),
        } as INotebookWithNotes;
    });

    return (
        <div className={styles['notes-page-container']}>
            <div className={styles['notes-page-navbar']}>
                <div className={styles['notes-page-navbar-logo']}>
                    <NavLink to="/" className={styles['notes-page-navbar-logo-link']}>
                        I-Note
                    </NavLink>
                </div>
                <div className={styles['notes-page-navbar-profile']}>
                    <Profile />
                </div>
                <div className={styles['notes-page-navbar-search']}>
                    <Search />
                </div>
                <div className={styles['notes-page-navbar-notes']}>
                    {notebooksWithNotes
                        .sort((first, second) => first.name.localeCompare(second.name))
                        .map((it) => (
                            <Notebook key={`notebook_container#${it.id}`} notebook={it} />
                        ))}
                    <Popup
                        trigger={
                            <div className={styles['notebook-row']}>
                                <Svg icon={Icons.Notebook} className={styles['notebook-row-notebook-icon']} />
                                <span className={styles['notebook-title']}>Создать новый</span>
                            </div>
                        }
                        nested
                        position="bottom left">
                        {(close) => {
                            return <NotebookPopup afterClick={() => close()} />;
                        }}
                    </Popup>
                </div>
            </div>
            <Workfield note={currentNote} onChange={handleNoteChange} onSave={handleNoteSave} />
        </div>
    );
}
