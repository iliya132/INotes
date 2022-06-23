import axios from "axios";
import properties from "../../properties/properties";
import { addNote, removeNote, removeNotebook, setShared, setState, updateNote } from "../reducers/notebooksReducer";
import { AppDispatch, store } from "../store";
import { INote, INotebook, INotebookWithNotes, INoteDTO } from "../types";

const baseUrl = properties.apiUrl;
const notebookurl = baseUrl + "api/notebook/"

export function fetchNotesThunk() {
    return async function fetchNotesThunk(dispatch: AppDispatch) {
        axios.get(notebookurl, { withCredentials: true })
            .then(response => {
                if (response.status === 200) {
                    dispatch(setState(response.data as INotebookWithNotes[]));
                } else {
                    //TODO обработка ошибок
                    console.error(response);
                }
            })
            .catch(reason => {
                //TODO обработка ошибок
                console.log(reason);
            })
    }
}

export function removeNotebookThunk(notebook: INotebook) {
    return async function removeNotebookThunk(dispatch: AppDispatch) {
        axios.delete(`${notebookurl}remove/${notebook.id}`, { withCredentials: true })
            .then((response) => {
                if (response.status === 200) {
                    dispatch(removeNotebook(notebook))
                } else {
                    //TODO обработка ошибок
                    console.error(response.statusText)
                }
            })
            .catch(reason => {
                //TODO обработка ошибок
                console.error(reason);
            })
    }
}

export function createNoteThunk(note: INoteDTO) {
    return async function createNoteThunk(dispatch: AppDispatch) {

        axios.post(`${notebookurl}add-note`, note, { withCredentials: true })
            .then(response => {
                if (response.status === 200) {
                    const newNote = response.data as INoteDTO;
                    const noteToAdd: INote = {
                        id: newNote.id,
                        content: newNote.content,
                        isNew: false,
                        name: newNote.name,
                        isPublicUrlShared: newNote.isShared,
                        publicUrl: newNote.publicUrl,
                        parent: store.getState().notebooksReducer.notebooks.filter(it => it.id === newNote.notebookId)[0]
                    }
                    dispatch(addNote(noteToAdd))
                } else {
                    //TODO обработка ошибок
                    console.error(response);
                }
            })
            .catch(reason => {
                //TODO обработка ошибок
                console.error(reason);
            })
    }
}

export function updateNoteThunk(note: INoteDTO) {
    return async function updateNoteThunk(dispatch: AppDispatch) {
        axios.put(`${notebookurl}update-note`, note, { withCredentials: true })
            .then(response => {
                if (response.status === 200) {
                    dispatch(updateNote(note))
                } else {
                    //TODO обработка ошибок
                    console.error(response);
                }
            })
            .catch(reason => {
                //TODO обработка ошибок
                console.error(reason);
            })
    }
}

export function removeNoteThunk(noteId: number) {
    return async function removeNoteThunk(dispatch: AppDispatch) {
        axios.delete(`${notebookurl}remove-note/${noteId}`, { withCredentials: true })
            .then(response => {
                if (response.status === 200) {
                    dispatch(removeNote(noteId));
                } else {
                    //TODO обработка ошибок
                    console.error(response);
                }
            })
            .catch(reason => {
                //TODO обработка ошибок
                console.error(reason);
            })
    }
}

export function setPublicUrlShared(noteId: number, isShared: boolean) {
    return async function setPublicUrlShared(dispatch: AppDispatch) {
        axios.post(`${notebookurl}share-note/${noteId}/${isShared}`, undefined, { withCredentials: true })
            .then(response => {
                if (response.status === 200) {
                    dispatch(setShared({noteId, isShared}));
                } else {
                    //TODO обработка ошибок
                    console.error(response);
                }
            })
            .catch(reason => {
                //TODO обработка ошибок
                console.error(reason);
            })
    }
}
