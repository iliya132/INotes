import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { INote, INotebook, INotebookWithNotes, INoteDTO, INoteSharedState, NotebooksState } from "../types";

const initialState: NotebooksState = {
    notebooks: [],
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

        },
        addNote: (state: NotebooksState, action: PayloadAction<INote>) => {
            console.log('added', action.payload);
            state.allNotes = [...state.allNotes, action.payload];
            state.selectedNote = action.payload;
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
                isNew: false,
                isPublicUrlShared: note.isShared,
                publicUrl: note.publicUrl
            }
            const allNotes = state.allNotes;
            const existedId = state.allNotes.findIndex(it => it.id === updatedNote.id);
            allNotes[existedId] = updatedNote
            state.allNotes = allNotes
        },
        removeNotebook: (state: NotebooksState, action: PayloadAction<INotebook>) => {
            state.notebooks = state.notebooks.filter(it => it.id !== action.payload.id)
            if (action.payload.id === state.selectedNotebook?.id) {
                selectDefaultIfNeeded(state);
            }
        },
        removeNote: (state: NotebooksState, action: PayloadAction<number>) => {
            state.allNotes = [...state.allNotes.filter(it => it.id !== action.payload)]
            if (state.selectedNote?.id === action.payload) {
                state.selectedNote = undefined
            }
        },
        selectNotebook: (state: NotebooksState, action: PayloadAction<number>) => {
            state.selectedNotebook = state.notebooks.filter(it => it.id === action.payload)[0];
            setDefaultSelectedNote(state);
        },
        selectNote: (state: NotebooksState, action: PayloadAction<INote>) => {
            state.selectedNote = action.payload;
        },
        setState: (state: NotebooksState, action: PayloadAction<INotebookWithNotes[]>) => {
            state.notebooks = action.payload.map(it => { return { id: it.id, name: it.name, color: it.color } })
            state.allNotes = action.payload.flatMap(it => it.notes.map(note => { return { ...note, parent: it, isNew: false } }))
            selectDefaultIfNeeded(state);
        },
        setShared: (state: NotebooksState, action: PayloadAction<INoteSharedState>) => {
            let note = state.allNotes.find(it => it.id === action.payload.noteId)
            if(note !== undefined){
                note.isPublicUrlShared = action.payload.isShared;
            }
        }

    }
});

export const { addNotebook, addNote, updateNotebook, updateNote, removeNotebook, removeNote, selectNotebook, selectNote, setState, setShared } = slice.actions;
export default slice.reducer;

export const notebooks = (state: RootState) => state.notebooksReducer.notebooks;
export const allNotes = (state: RootState) => state.notebooksReducer.allNotes;
export const currentNotes = (state: RootState) => state.notebooksReducer.allNotes.filter(it => it.parent.id === state.notebooksReducer.selectedNotebook?.id);
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
}

function setDefaultSelectedNote(state: NotebooksState) {
    const currentNotes = state.allNotes.filter(it => it.parent.id === state.selectedNotebook?.id);
    if (currentNotes && currentNotes.length > 0) {
        state.selectedNote = currentNotes[0];
    } else {
        state.selectedNote = undefined;
    }
}
