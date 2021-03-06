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
        },
        addNote: (state: NotebooksState, action: PayloadAction<INote>) => {
            state.allNotes = [...state.allNotes, action.payload];
        },
        updateNotebook: (state: NotebooksState, action: PayloadAction<INotebook>) => {
            state.notebooks = [...state.notebooks.filter(it => it.id !== action.payload.id), action.payload]
        },
        updateNote: (state: NotebooksState, action: PayloadAction<INoteDTO>) => {
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
        },
        removeNote: (state: NotebooksState, action: PayloadAction<number>) => {
            state.allNotes = [...state.allNotes.filter(it => it.id !== action.payload)]
        },
        setState: (state: NotebooksState, action: PayloadAction<INotebookWithNotes[]>) => {
            state.notebooks = action.payload.map(it => { return { id: it.id, name: it.name, color: it.color } })
            state.allNotes = action.payload.flatMap(it => it.notes.map(note => { return { ...note, parent: it, isNew: false } }))
        },
        setShared: (state: NotebooksState, action: PayloadAction<INoteSharedState>) => {
            let note = state.allNotes.find(it => it.id === action.payload.noteId)
            if (note !== undefined) {
                note.isPublicUrlShared = action.payload.isShared;
            }
        },
        clearNotesState: (state: NotebooksState) => {
            state.allNotes = [];
            state.notebooks = [];
        }

    }
});

export const { addNotebook, addNote, updateNotebook, updateNote, removeNotebook, removeNote, setState, setShared, clearNotesState } = slice.actions;
export default slice.reducer;

export const notebooks = (state: RootState) => state.notebooksReducer.notebooks;
export const allNotes = (state: RootState) => state.notebooksReducer.allNotes;
export const notebooksWithNotes = (state: RootState) => {
    const { notebooks, allNotes } = state.notebooksReducer;
    return {notebooks, allNotes};
}
