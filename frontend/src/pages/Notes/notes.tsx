import React, { useEffect, useState } from 'react';
import styles from './notes.scss';
import Workfield from '../../components/WorkField';
import { useSelector } from 'react-redux';
import { allNotes } from '../../store/reducers/notebooksReducer';
import { INote } from '../../store/types';
import { Navigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { REDIRECT_URL } from '../../Misc/constant';

export function NotesPage() {
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
        localStorage.removeItem(REDIRECT_URL);
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

    if (currentNote == undefined &&
        urlParams.selectedNote != undefined &&
        notes &&
        notes.length > 0) {
        return <Navigate to="/notFound" replace={true} />;
    }

    return (
        <div className={styles['notes-page-container']}>
            <Navbar />
            <Workfield note={currentNote} onChange={handleNoteChange} onSave={handleNoteSave} />
        </div>
    );
}
