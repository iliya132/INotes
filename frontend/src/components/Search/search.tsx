import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import notesController from '../../controllers/NotesController';
import { ISearchResult } from '../../controllers/types';
import { selectNote, selectNotebook } from '../../store/reducers/notebooksReducer';
import { useAppDispatch } from '../../store/store.hooks';
import Svg from '../Svg';
import { Icons } from '../Svg/types';
import FoundResult from './components';
import styles from './search.scss';
import ISearchProps from './types';

export function Search(props: ISearchProps) {
    const dispatch = useAppDispatch();
    const { onChange } = props;
    const [foundResults, setFoundResults] = useState({
        notebooks: [],
        notes: [],
    } as ISearchResult);
    const [isOpen, setOpen] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFoundResults(notesController.find(e.target.value));
        if (onChange) {
            onChange(e);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Popup
            onClose={handleClose}
            open={isOpen}
            trigger={
                <div className={styles['input-container']}>
                    <input
                        id="search"
                        type="text"
                        className={styles['search-field']}
                        placeholder="Type here to search..."
                        onChange={(e) => {
                            handleInputChange(e);
                        }}
                        autoComplete="disabled"
                    />
                    <Svg icon={Icons.Search} className={styles['eye-icon']} />
                </div>
            }
            arrow={false}>
            {(close) => {
                return (
                    <div className={styles['popup-container']}>
                        {foundResults.notebooks.map((notebook) => (
                            <FoundResult
                                title={notebook.notebook.name}
                                context={notebook.context}
                                key={`notebook_result_${notebook.notebook.id}`}
                                onClick={() => {
                                    close();
                                    dispatch(selectNotebook(notebook.notebook.id));
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
                                    dispatch(selectNote(note.note));
                                }}
                            />
                        ))}
                    </div>
                );
            }}
        </Popup>
    );
}
