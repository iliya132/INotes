import React, { useEffect, useState } from 'react';
import Note from '../../components/Note';
import { Page } from '../../components/Page/page';
import styles from './notes.scss';
import Select from 'react-select';
import { selectStyle } from './notes.constants';
import Workfield from '../../components/WorkField';
import { useSelector } from 'react-redux';
import {
    currentNotes,
    notebooks,
    selectedNote as selectedNoteState,
    selectedNotebook as selectedNotebookState,
    selectNote,
    selectNotebook,
} from '../../store/reducers/notebooksReducer';
import { useAppDispatch } from '../../store/store.hooks';
import Svg from '../../components/Svg';
import { Icons } from '../../components/Svg/types';
import notesController from '../../controllers/NotesController';
import Popup from 'reactjs-popup';
import NotebookPopup from '../../components/NotebooCreatePopup';
import { INote } from '../../store/types';

export default function Notes() {
    const dispatch = useAppDispatch();
    const [isContextChanged, setContextChanged] = useState(false);
    const options = useSelector(notebooks).map((it) => {
        return { value: it.id.toString(), label: it.name };
    });

    useEffect(() => {
        window.onbeforeunload = function(){
            if(isContextChanged){
                return "Вы не сохранили внесенные изменения. Если вы перейдете на другую страницу они будут потеряны"
            }
        }
        return function cleanup(){
            window.onbeforeunload = null
        }
    })
    
    const notes = useSelector(currentNotes);
    const selectedNote = useSelector(selectedNoteState);
    const selectedNotebook = useSelector(selectedNotebookState);
    const defaultSelectednotebook = selectedNotebook
        ? {
            value: selectedNotebook.id.toString(),
            label: selectedNotebook.name,
        }
        : undefined;

    const handleNotebookChange = (event: { value: string; label: string }) => {
        dispatch(selectNotebook(Number.parseInt(event.value)));
    };

    const handleNotebookRemoval = () => {
        if (selectedNotebook) {
            notesController.removeNotebook(selectedNotebook);
        }
    };

    const handleNoteRemove = () => {
        if (selectedNote) {
            notesController.removeNote(selectedNote.id);
        }
    };

    const handleNoteCreate = () => {
        notesController.createNote('Заметка от ' + new Date().toLocaleDateString());
    };

    const handleNoteSelected = (note: INote) => {
        if(isContextChanged){
            if(!confirm("Вы не сохранили внесенные изменения. При переходе они будут потеряны. Продолжить?")){
                return;
            }
        }
        setContextChanged(false)
        dispatch(selectNote(note));
    };

    const handleNoteChange = () => {
        setContextChanged(true);
    }

    const handleNoteSave = () => {
        setContextChanged(false);
    }

    return (
        <Page isFullWidth={true}>
            <div className={styles['notes-container']}>
                <div className={styles['notes-nav']}>
                    <div className={styles['nav-commands']}>
                        <Select
                            options={options}
                            styles={selectStyle}
                            onChange={handleNotebookChange}
                            value={defaultSelectednotebook}
                        />
                        <Popup trigger={<Svg icon={Icons.Dots} className={styles['more-btn']} />} position="top left">
                            <div className={styles['context-field']}>
                                <div className={styles['notebook-context-option']} onClick={handleNoteCreate}>
                                    Добавить заметку
                                </div>
                                <div className={styles['notebook-context-option']}>
                                    <Popup
                                        trigger={<span>Добавить записную книжку</span>}
                                        nested
                                        position="bottom left">
                                        <NotebookPopup afterClick={() => close()} />
                                    </Popup>
                                </div>
                                <div className={styles['notebook-context-option']} onClick={handleNoteRemove}>
                                    Удалить заметку
                                </div>
                                <div className={styles['notebook-context-option']} onClick={handleNotebookRemoval}>
                                    удалить записную книжку
                                </div>
                            </div>
                        </Popup>
                    </div>

                    <div className={styles['notes-list']}>
                        <>
                            {notes.map((it) => (
                                <Note key={it.id} note={it} isSelected={it.id === selectedNote?.id} onClick={() => handleNoteSelected(it)}/>
                            ))}
                        </>
                    </div>
                </div>
                <Workfield note={selectedNote} onChange={handleNoteChange} onSave={handleNoteSave}/>
            </div>
        </Page>
    );
}
