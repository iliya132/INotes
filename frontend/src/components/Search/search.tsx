import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import notesController from '../../controllers/NotesController';
import { ISearchResult } from '../../controllers/types';
import { allNotes } from '../../store/reducers/notebooksReducer';
import Svg from '../Svg';
import { Icons } from '../Svg/types';
import FoundResult from './components';
import styles from './search.scss';
import ISearchProps from './types';

export function Search(props: ISearchProps) {
    const { onChange } = props;
    const inputRef = useRef(null);
    const nav = useNavigate();
    const allNotesState = useSelector(allNotes);
    const [foundResults, setFoundResults] = useState({
        notebooks: [],
        notes: [],
    } as ISearchResult);
    const [isOpen, setOpen] = useState(false);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        
        const found = notesController.find(e.target.value)
        setFoundResults(found);
        if (onChange) {
            onChange(e);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const clearSearchInput = () => {
        (inputRef!.current! as HTMLInputElement).value = '';
        setFoundResults({ notebooks: [], notes: [] });
    };

    const handleSelectNote = (noteId: number) => {
        nav("/" + noteId);
    }

    const handleSelectNotebook = (notebookId: number) => {
        const firstNote = allNotesState.filter(it=> it.parent.id === notebookId)[0];
        handleSelectNote(firstNote.id);
    }

    const isAnyResultsFound = foundResults.notebooks.length > 0 || foundResults.notes.length > 0;

    return (
        <Popup
            onClose={handleClose}
            open={isOpen}
            position="bottom left"
            trigger={
                <div className={styles['input-container']} data-testid="search-container">
                    <input
                        ref={inputRef}
                        id="search"
                        type="text"
                        className={styles['search-field']}
                        placeholder="Type here to search..."
                        onChange={(e) => {
                            handleInputChange(e);
                        }}
                        autoComplete="disabled"
                        data-testid="search-input"
                    />
                    <Svg icon={Icons.Search} className={styles['eye-icon']} />
                </div>
            }
            arrow={false}>
            {(close) => {
                return !isAnyResultsFound ? undefined : (
                    <div className={styles['popup-container']}>
                        {foundResults.notebooks.map((notebook) => (
                            <FoundResult
                                title={notebook.notebook.name}
                                context={notebook.context}
                                key={`notebook_result_${notebook.notebook.id}`}
                                onClick={() => {
                                    close();
                                    clearSearchInput();
                                    handleSelectNotebook(notebook.notebook.id);
                                }}
                            />
                        ))}
                        {foundResults.notes.map((note) => (
                            <FoundResult
                                title={note.note.name}
                                context={note.context}
                                key={`note_result_${note.note.id}`}
                                onClick={() => {
                                    close();
                                    clearSearchInput();
                                    handleSelectNote(note.note.id);
                                }}
                            />
                        ))}
                    </div>
                );
            }}
        </Popup>
    );
}
