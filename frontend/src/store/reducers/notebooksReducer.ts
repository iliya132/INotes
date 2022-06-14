import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { INote, INotebook, INotebookWithNotes, INoteDTO, NotebooksState } from "../types";

const initialState: NotebooksState = {
    notebooks: [],
    currentNotebookNotes: [],
    allNotes: []
};

const slice = createSlice({
    name: "notebooksReducer",
    initialState: initialState,
    reducers: {
        addNotebook: (state: NotebooksState, action: PayloadAction<INotebook>) => {
            state.notebooks = [...state.notebooks, action.payload]
            state.selectedNotebook = action.payload;
            state.selectedNote = undefined;
            state.currentNotebookNotes = [];

        },
        addNote: (state: NotebooksState, action: PayloadAction<INote>) => {
            console.log('added', action.payload);
            state.allNotes = [...state.allNotes, action.payload];
            state.selectedNote = action.payload;
            state.currentNotebookNotes = [...state.currentNotebookNotes, action.payload]
        },
        updateNotebook: (state: NotebooksState, action: PayloadAction<INotebook>) => {
            state.notebooks = [...state.notebooks.filter(it => it.id !== action.payload.id), action.payload]
        },
        updateNote: (state: NotebooksState, action: PayloadAction<INoteDTO>) => {
            console.log('updated', action.payload);
            const note = action.payload;
            const updatedNote: INote = {
                content: note.content,
                id: note.id,
                name: note.name,
                parent: state.notebooks.filter(it => it.id === note.notebookId)[0],
                isNew: false
            }
            const allNotes = state.allNotes;
            const existedId = state.allNotes.findIndex(it => it.id === updatedNote.id);
            allNotes[existedId] = updatedNote
            state.allNotes = allNotes
            state.currentNotebookNotes = state.allNotes.filter(it => it.parent.id === note.notebookId)
        },
        removeNotebook: (state: NotebooksState, action: PayloadAction<INotebook>) => {
            state.notebooks = state.notebooks.filter(it => it.id !== action.payload.id)
            if (action.payload.id === state.selectedNotebook?.id) {
                selectDefaultIfNeeded(state);
            }
        },
        removeNote: (state: NotebooksState, action: PayloadAction<INote>) => {
            state.allNotes = [...state.allNotes.filter(it => it.id !== action.payload.id)]
        },
        selectNotebook: (state: NotebooksState, action: PayloadAction<number>) => {
            state.selectedNotebook = state.notebooks.filter(it => it.id === action.payload)[0];
            state.currentNotebookNotes = state.allNotes.filter(it => it.parent.id === action.payload)
            setDefaultSelectedNote(state);
        },
        selectNote: (state: NotebooksState, action: PayloadAction<INote>) => {
            state.selectedNote = action.payload;
        },
        setState: (state: NotebooksState, action: PayloadAction<INotebookWithNotes[]>) => {
            state.notebooks = action.payload.map(it => { return { id: it.id, name: it.name, color: it.color } })
            state.allNotes = action.payload.flatMap(it => it.notes.map(note => { return { ...note, parent: it, isNew: false } }))
            selectDefaultIfNeeded(state);
        }

    }
});

export const { addNotebook, addNote, updateNotebook, updateNote, removeNotebook, removeNote, selectNotebook, selectNote, setState } = slice.actions;
export default slice.reducer;

export const notebooks = (state: RootState) => state.notebooksReducer.notebooks;
export const allNotes = (state: RootState) => state.notebooksReducer.allNotes;
export const currentNotes = (state: RootState) => state.notebooksReducer.currentNotebookNotes;
export const selectedNotebook = (state: RootState) => state.notebooksReducer.selectedNotebook;
export const selectedNote = (state: RootState) => state.notebooksReducer.selectedNote;

function selectDefaultIfNeeded(state: NotebooksState) {
    if (state.notebooks.length > 0) {
        setDefaultSelectedNotebook(state);
        setDefaultSelectedNote(state);
    } else {
        setNoneSelected(state);
    }
}

function setNoneSelected(state: NotebooksState) {
    state.selectedNotebook = undefined;
    state.selectedNote = undefined;
}

function setDefaultSelectedNotebook(state: NotebooksState) {
    const newSelected = state.notebooks[0].id;
    state.selectedNotebook = state.notebooks.filter(it => it.id === newSelected)[0];
    state.currentNotebookNotes = state.allNotes.filter(it => it.parent.id === newSelected);
}

function setDefaultSelectedNote(state: NotebooksState) {
    if (state.currentNotebookNotes.length > 0) {
        state.selectedNote = state.currentNotebookNotes[0];
    } else {
        state.selectedNote = undefined;
    }
}
