import axios from "axios";
import { Dispatch } from "react";
import { addNotebook } from "../store/reducers/notebooksReducer";
import { store } from "../store/store";
import { createNoteThunk, fetchNotesThunk, removeNotebookThunk, removeNoteThunk, setPublicUrlShared, updateNoteThunk } from "../store/thunks/notesThunks";
import { INotebook, INoteDTO } from "../store/types";
import BaseController from "./base/BaseController";
import { NotebookDTO } from "./types";

class NotesController extends BaseController {
    private notebookurl = this.baseUrl + "api/notebook/"
    private dispatchStore = store.dispatch as typeof store.dispatch | Dispatch<any>

    createNotebook(name: string) {
        const newNotebook: NotebookDTO = {
            id: 0,
            color: 'blue',
            name: name
        };
        axios.post(this.notebookurl + "save", newNotebook, { withCredentials: true })
            .then((response) => {
                store.dispatch(addNotebook(response.data))
            })
            .catch(reason => {
                console.log(reason)
            })
    }

    createNote(name: string) {
        const selectedNotebook = store.getState().notebooksReducer.selectedNotebook;
        if (!selectedNotebook) {
            throw Error("Cant create note without binding to parent");
        }
        const newNote: INoteDTO = {
            id: 0,
            name: name,
            notebookId: selectedNotebook.id,
            content: `## ${name}\n\n---\n\n`,
            isShared: false,
            publicUrl: ""
        }
        this.dispatchStore(createNoteThunk(newNote))
    }

    fetchNotes() {
        this.dispatchStore(fetchNotesThunk())
    }

    removeNotebook(notebook: INotebook) {
        if (notebook) {
            this.dispatchStore(removeNotebookThunk(notebook));
        }
    }

    updateNote(note: INoteDTO) {
        if (note) {
            this.dispatchStore(updateNoteThunk(note));
        }
    }

    removeNote(noteId: number){
        this.dispatchStore(removeNoteThunk(noteId));
    }

    setShared(noteId: number, isShared: boolean){
        this.dispatchStore(setPublicUrlShared(noteId, isShared));
    }
}

const notesController = new NotesController();
export default notesController;
