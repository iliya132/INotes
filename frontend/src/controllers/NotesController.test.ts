/* eslint-disable no-undef */
import axios from 'axios';
import { INotebookWithNotes, INotebook, INote, INoteDTO } from '../store/types';
import { jest } from '@jest/globals';
import { store } from '../store/store';
import { addNotebook, setState } from "../store/reducers/notebooksReducer";
import notesController from './NotesController';

jest.mock('axios');

beforeEach(() => {
    jest.resetAllMocks();
    store.dispatch(setState([]));
})

describe('notes controller test', () => {
    it('can create notebook', async () => {
        const result: INotebook = {
            color: 'red',
            id: 1,
            name: 'test-notebook',
            isExpanded: false
        };
        mockAxiosPostResult({ status: 200, data: result });

        await notesController.createNotebook('test-notebook');

        const notesState = getNotesState();
        expect(notesState.notebooks).toHaveLength(1);
        expect(notesState.notebooks[0]).toEqual(result);
    })

    test('can create note', async () => {
        const notebook: INotebook = getTestNotebook();
        store.dispatch(addNotebook(notebook));
        expect(getNotesState().notebooks).toHaveLength(1);
        const note: INote = getTestNote(notebook);
        const apiNote: INoteDTO = {
            content: note.content,
            id: note.id,
            isShared: note.isPublicUrlShared,
            name: note.name,
            notebookId: note.parent.id,
            publicUrl: note.publicUrl,
            tags: []
        };
        mockAxiosPostResult({ status: 200, data: apiNote });
        await notesController.createNote('test-content', 1);
        const notesState = getNotesState();
        expect(notesState.notebooks).toHaveLength(1);
        expect(notesState.allNotes).toHaveLength(1);
        expect(notesState.allNotes[0]).toEqual(note);
    })

    test('can copy note', async () => {
        const notebook: INotebook = getTestNotebook();
        store.dispatch(addNotebook(notebook));
        expect(getNotesState().notebooks).toHaveLength(1);
        const note: INote = getTestNote(notebook);
        const apiNote: INoteDTO = {
            content: note.content,
            id: note.id,
            isShared: note.isPublicUrlShared,
            name: note.name,
            notebookId: note.parent.id,
            publicUrl: note.publicUrl,
            tags: []
        };
        mockAxiosPostResult({ status: 200, data: apiNote });
        await notesController.copyNote(apiNote);
        const notesState = getNotesState();
        expect(notesState.notebooks).toHaveLength(1);
        expect(notesState.allNotes).toHaveLength(1);
        expect(notesState.allNotes[0]).toEqual(note);
    })

    test('can fetch notes', async () => {
        const notebook = getTestNotebook();
        const notes = [getTestNote(notebook)];
        const fetchResult: INotebookWithNotes = {
            color: notebook.color,
            id: notebook.id,
            name: notebook.name,
            notes: notes,
            isExpanded: false
        };
        mockAxiosGetResult({ status: 200, data: [fetchResult] });
        await notesController.fetchNotes();
        const notesState = getNotesState();
        expect(notesState.notebooks).toHaveLength(1);
        expect(notesState.allNotes).toHaveLength(1);
        expect(notesState.allNotes[0]).toEqual(notes[0]);
    })

    test('can remove notebook', async () => {
        const notebook = getTestNotebook();
        store.dispatch(addNotebook(notebook));
        expect(getNotesState().notebooks).toHaveLength(1);
        mockAxiosDeleteResult({ status: 200 });
        await notesController.removeNotebook(notebook);
        const state = getNotesState();
        expect(state.notebooks).toHaveLength(0);
    })

    test('can remove note', async () => {
        const { note } = withDefaultStoreState();
        mockAxiosDeleteResult({ status: 200 });
        await notesController.removeNote(note.id);
        const state = getNotesState();
        expect(state.notebooks).toHaveLength(1);
        expect(state.allNotes).toHaveLength(0);
    })

    test('can update note', async () => {
        mockAxiosPutResult({ status: 200 });
        const { notebook, note } = withDefaultStoreState();
        const noteDTO: INoteDTO = {
            content: 'changed-content',
            id: note.id,
            isShared: note.isPublicUrlShared,
            name: 'changed-title',
            notebookId: note.parent.id,
            publicUrl: note.publicUrl,
            tags: []
        };
        const expectedNote: INote = {
            content: noteDTO.content,
            id: note.id,
            isPublicUrlShared: noteDTO.isShared,
            name: noteDTO.name,
            isNew: false,
            parent: notebook,
            publicUrl: noteDTO.publicUrl,
            tags: []
        };
        await notesController.updateNote(noteDTO);
        const state = getNotesState();
        expect(state.notebooks).toHaveLength(1);
        expect(state.allNotes).toHaveLength(1);
        expect(state.allNotes[0]).toEqual(expectedNote)
    })

    test('can share note', async () => {
        mockAxiosPostResult({ status: 200 });
        const { note } = withDefaultStoreState();
        await notesController.setShared(note.id, true);
        const state = getNotesState();
        expect(state.notebooks).toHaveLength(1);
        expect(state.allNotes).toHaveLength(1);
        expect(state.allNotes[0].isPublicUrlShared).toBe(true);
    })

    test('can find by text', () => {
        const { note, notebook } = withDefaultStoreState();
        const result = notesController.find('test');
        expect(result.notebooks).toHaveLength(1);
        expect(result.notes).toHaveLength(1);
        expect(result.notebooks[0]).toEqual({ context: '%%test%%-notebook', notebook: notebook });
        expect(result.notes[0]).toEqual({ context: '%%test%%-content', note: note });
    })

    test('return empty result when search text is too short', () => {
        withDefaultStoreState();
        const result = notesController.find('t');
        expect(result.notebooks).toHaveLength(0);
        expect(result.notes).toHaveLength(0);
    })
})

function mockAxiosPostResult(result: any) {
    (axios.post as jest.Mock).mockResolvedValue(result);
}

function mockAxiosGetResult(result: any) {
    (axios.get as jest.Mock).mockResolvedValue(result);
}

function mockAxiosDeleteResult(result: any) {
    (axios.delete as jest.Mock).mockResolvedValue(result);
}

function mockAxiosPutResult(result: any) {
    (axios.put as jest.Mock).mockResolvedValue(result);
}

function getNotesState() { return store.getState().notebooksReducer; }

function getTestNotebook() {
    return {
        color: 'red',
        id: 1,
        name: 'test-notebook',
        isExpanded: false
    };
}

function getTestNote(notebook: INotebook): INote {
    return {
        content: 'test-content',
        id: 1,
        isNew: false,
        isPublicUrlShared: false,
        name: 'test-cotent',
        parent: notebook,
        publicUrl: 'abc',
        tags: []
    };
}

function withDefaultStoreState() {
    const notebook = getTestNotebook();
    const note = getTestNote(notebook);
    const notebookWithNotes: INotebookWithNotes = {
        color: notebook.color,
        id: notebook.id,
        name: notebook.name,
        notes: [note],
        isExpanded: false
    };
    store.dispatch(setState([notebookWithNotes]));
    return { notebook, note, notebookWithNotes };
}