import axios from "axios";
import { Dispatch } from "react";
import properties from "../properties/properties";
import { addNotebook } from "../store/reducers/notebooksReducer";
import { store } from "../store/store";
import { createNoteThunk, fetchNotesThunk, removeNotebookThunk, removeNoteThunk, setPublicUrlShared, updateNoteThunk, updateTags } from "../store/thunks/notesThunks";
import { INote, INotebook, INoteDTO } from "../store/types";
import BaseController from "./base/BaseController";
import { IFoundNote, IFoundNotebook, ISearchResult, NotebookDTO } from "./types";

const searchContextOffset = properties.searchContextOffset;
const minSearchContextOffset = properties.minSearchContextOffset;

class NotesController extends BaseController {
    private notebookurl = this.baseUrl + "api/notebook/"
    private dispatchStore = store.dispatch as typeof store.dispatch | Dispatch<any>

    async createNotebook(name: string) {
        const newNotebook: NotebookDTO = {
            id: 0,
            color: 'blue',
            name: name
        };
        return axios.post(this.notebookurl + "save", newNotebook, { withCredentials: true })
            .then((response) => {
                store.dispatch(addNotebook(response.data))
            })
            .catch(reason => {
                console.log(reason)
            })
    }

    async createNote(name: string, notebookId: number) {
        const selectedNotebook = store.getState().notebooksReducer.notebooks.filter(it => it.id === notebookId)[0];
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
        return this.dispatchStore(createNoteThunk(newNote))
    }

    async copyNote(note: INoteDTO) {
        return this.dispatchStore(createNoteThunk(note))
    }

    async fetchNotes() {
        return this.dispatchStore(fetchNotesThunk())
    }

    async removeNotebook(notebook: INotebook) {
        if (notebook) {
            return this.dispatchStore(removeNotebookThunk(notebook));
        }
    }

    async updateNote(note: INoteDTO) {
        if (note) {
            return this.dispatchStore(updateNoteThunk(note));
        }
    }

    async removeNote(noteId: number) {
        return this.dispatchStore(removeNoteThunk(noteId));
    }

    async updateTags(note: INote){
        return this.dispatchStore(updateTags(note));
    }

    async setShared(noteId: number, isShared: boolean) {
        return this.dispatchStore(setPublicUrlShared(noteId, isShared));
    }

    find(text: string): ISearchResult {
        if (text.length < 2) {
            return {
                notes: [],
                notebooks: []
            }
        }
        const noteBookState = store.getState().notebooksReducer;
        const notes = noteBookState.allNotes;
        const notebooks = noteBookState.notebooks;
        const foundNotes = notes.filter(it => filterNotesContains(it, text)).map(it => getFoundNoteContext(it, text))
        const foundNotebooks = notebooks.filter(it => filterNotebookContains(it, text)).map(it => getFoundNotebookContext(it, text));
        return {
            notes: foundNotes,
            notebooks: foundNotebooks
        };
    }
}

function filterNotesContains(note: INote, text: string): boolean {
    return note.content.toLowerCase().includes(text.toLowerCase()) || note.tags.filter(it => it.includes(text)).length > 0;
}

function getFoundNoteContext(note: INote, text: string): IFoundNote {
    return {
        note,
        context: getContext(note.content, text, note.tags)
    };
}

function getFoundNotebookContext(notebook: INotebook, text: string): IFoundNotebook {
    return {
        notebook,
        context: getContext(notebook.name, text, [])
    };
}

// Личная записная книжка
// Личная

function getContext(content: string, search: string, tags: string[]): string {
    const foundIndex = content.toLowerCase().indexOf(search);
    if(foundIndex === -1){
        return "Метки: " + tags.map(it => {
            if(it.includes(search)){
                return "%%" + it + "%%"
            }
            return it;
        });
    }
    const endIndex = foundIndex + search.length;
    let indexOfContext = foundIndex;
    let indexOfEndContext = endIndex + searchContextOffset;

    if (search.length < minSearchContextOffset) {
        const diff = minSearchContextOffset - search.length;

        indexOfContext -= diff / 2;
        indexOfEndContext += diff / 2;
        if (indexOfContext < 0) {
            indexOfEndContext -= indexOfContext;
        }
        if (indexOfEndContext > content.length) {
            indexOfContext -= indexOfEndContext - content.length;
        }
    }

    if (indexOfContext < 0) {
        indexOfContext = 0;
    }

    if (indexOfEndContext > content.length) {
        indexOfEndContext = content.length;
    }
    return content.substring(indexOfContext, foundIndex) + "%%" + content.substring(foundIndex, endIndex) + "%%" + content.substring(endIndex, indexOfEndContext);

}

function filterNotebookContains(notebook: INotebook, text: string): boolean {
    return notebook.name.toLowerCase().includes(text.toLowerCase());
}

const notesController = new NotesController();
export default notesController;
