/* eslint-disable no-undef */
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { RootState } from '../../store/store';
import { INote, INotebook } from '../../store/types';
import { Search } from './search';
import { authSlice } from '../../store/reducers/authReducer';
import { notesSlice } from '../../store/reducers/notebooksReducer';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { IFoundNote, IFoundNotebook, ISearchResult } from '../../controllers/types';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import notesController from '../../controllers/NotesController';

//#region common setup
jest.mock('../../controllers/NotesController', () => ({ find: jest.fn() }));

let initialState: RootState = {
    authReducer: {
        error: '',
        isAuth: true,
        user: { roles: ['user'], userName: 'test-user', avatarUrl: '/default.png' },
        validation: {
            isSucceded: true,
            errors: {},
        },
    },
    notebooksReducer: {
        notebooks: [],
        allNotes: [],
    },
};

let store = configureStore({
    reducer: {
        authReducer: authSlice(initialState.authReducer).reducer,
        notebooksReducer: notesSlice(initialState.notebooksReducer).reducer,
    },
});
beforeEach(() => {
    store = configureStore({
        reducer: {
            authReducer: authSlice(initialState.authReducer).reducer,
            notebooksReducer: notesSlice(initialState.notebooksReducer).reducer,
        },
    });
});
//#endregion

describe('search field tests', () => {
    it('can be rendered', () => {
        const currentState = getSomeNotes(initialState);
        store = configureStore({
            reducer: {
                authReducer: authSlice(initialState.authReducer).reducer,
                notebooksReducer: notesSlice(currentState.notebooksReducer).reducer,
            },
        });
        act(() => {
            render(
                <Provider store={store}>
                    <MemoryRouter>
                        <Routes>
                            <Route path="/" element={<Search />} />
                        </Routes>
                    </MemoryRouter>
                </Provider>,
            );
        });
    });

    it('should match snapshot', () => {
        const currentState = getSomeNotes(initialState);
        store = configureStore({
            reducer: {
                authReducer: authSlice(initialState.authReducer).reducer,
                notebooksReducer: notesSlice(currentState.notebooksReducer).reducer,
            },
        });
        act(() => {
            render(
                <Provider store={store}>
                    <MemoryRouter>
                        <Routes>
                            <Route path="/" element={<Search />} />
                        </Routes>
                    </MemoryRouter>
                </Provider>,
            );
        });
        expect(document.body.innerHTML).toMatchSnapshot('search field snapshot');
    });

    it('can find notebook', async () => {
        const find = jest.fn((text: string): ISearchResult => {
            const noteBookState = store.getState().notebooksReducer;
            const notes = noteBookState.allNotes;
            const notebooks = noteBookState.notebooks;
            const foundNotes = notes
                .filter((it) => filterNotesContains(it, text))
                .map((it) => getFoundNoteContext(it, text));
            const foundNotebooks = notebooks
                .filter((it) => filterNotebookContains(it, text))
                .map((it) => getFoundNotebookContext(it, text));
            return {
                notes: foundNotes,
                notebooks: foundNotebooks,
            };
        });
        notesController.find = find;

        const user = userEvent.setup();
        const currentState = getSomeNotes(initialState);
        store = configureStore({
            reducer: {
                authReducer: authSlice(initialState.authReducer).reducer,
                notebooksReducer: notesSlice(currentState.notebooksReducer).reducer,
            },
        });
        act(() => {
            render(
                <Provider store={store}>
                    <MemoryRouter>
                        <Routes>
                            <Route path="/" element={<Search />} />
                        </Routes>
                    </MemoryRouter>
                </Provider>,
            );
        });
        const searchContainer = screen.getByTestId('search-container');
        const input = screen.getByTestId('search-input');
        expect(searchContainer).not.toBeNull();
        expect(input).not.toBeNull();

        let notebookToFind: string = currentState.notebooksReducer.notebooks[0].name;
        await act(async () => {
            await user.click(searchContainer);
            await user.type(input, notebookToFind);
        });
        const popupContainer = document.body!.querySelector('.popup-container');
        expect(popupContainer).not.toBeNull();
        expect(popupContainer?.textContent).toContain(notebookToFind);
    });

    it('can find note', async () => {
        const find = jest.fn((text: string): ISearchResult => {
            const noteBookState = store.getState().notebooksReducer;
            const notes = noteBookState.allNotes;
            const notebooks = noteBookState.notebooks;
            const foundNotes = notes
                .filter((it) => filterNotesContains(it, text))
                .map((it) => getFoundNoteContext(it, text));
            const foundNotebooks = notebooks
                .filter((it) => filterNotebookContains(it, text))
                .map((it) => getFoundNotebookContext(it, text));
            return {
                notes: foundNotes,
                notebooks: foundNotebooks,
            };
        });
        notesController.find = find;

        const user = userEvent.setup();
        const currentState = getSomeNotes(initialState);
        store = configureStore({
            reducer: {
                authReducer: authSlice(initialState.authReducer).reducer,
                notebooksReducer: notesSlice(currentState.notebooksReducer).reducer,
            },
        });
        act(() => {
            render(
                <Provider store={store}>
                    <MemoryRouter>
                        <Routes>
                            <Route path="/" element={<Search />} />
                        </Routes>
                    </MemoryRouter>
                </Provider>,
            );
        });
        const searchContainer = screen.getByTestId('search-container');
        const input = screen.getByTestId('search-input');
        expect(searchContainer).not.toBeNull();
        expect(input).not.toBeNull();

        let noteToFind: string = currentState.notebooksReducer.allNotes[0].content.substring(0, 5);
        await act(async () => {
            await user.click(searchContainer);
            await user.type(input, noteToFind);
        });
        const popupContainer = document.body!.querySelector('.popup-container');
        expect(popupContainer).not.toBeNull();
        expect(popupContainer?.textContent).toContain(noteToFind);
    });

    it('should close on click outside', async () => {
        const find = jest.fn((text: string): ISearchResult => {
            const noteBookState = store.getState().notebooksReducer;
            const notes = noteBookState.allNotes;
            const notebooks = noteBookState.notebooks;
            const foundNotes = notes
                .filter((it) => filterNotesContains(it, text))
                .map((it) => getFoundNoteContext(it, text));
            const foundNotebooks = notebooks
                .filter((it) => filterNotebookContains(it, text))
                .map((it) => getFoundNotebookContext(it, text));
            return {
                notes: foundNotes,
                notebooks: foundNotebooks,
            };
        });
        notesController.find = find;

        const user = userEvent.setup();
        const currentState = getSomeNotes(initialState);
        store = configureStore({
            reducer: {
                authReducer: authSlice(initialState.authReducer).reducer,
                notebooksReducer: notesSlice(currentState.notebooksReducer).reducer,
            },
        });
        act(() => {
            render(
                <Provider store={store}>
                    <MemoryRouter>
                        <Routes>
                            <Route path="/" element={<Search />} />
                        </Routes>
                    </MemoryRouter>
                </Provider>,
            );
        });
        const searchContainer = screen.getByTestId('search-container');
        const input = screen.getByTestId('search-input');
        expect(searchContainer).not.toBeNull();
        expect(input).not.toBeNull();

        let noteToFind: string = currentState.notebooksReducer.allNotes[0].content.substring(0, 5);
        await act(async () => {
            await user.click(searchContainer);
            await user.type(input, noteToFind);
        });
        let popupContainer = document.body!.querySelector('.popup-container');
        expect(popupContainer).not.toBeNull();
        expect(popupContainer?.textContent).toContain(noteToFind);

        await act(async () => {
            await user.click(document.body);
        });

        popupContainer = document.body!.querySelector('.popup-container');
        expect(popupContainer).toBeNull();
    });

    it('should clear found results on click', async () => {
        const find = jest.fn((text: string): ISearchResult => {
            const noteBookState = store.getState().notebooksReducer;
            const notes = noteBookState.allNotes;
            const notebooks = noteBookState.notebooks;
            const foundNotes = notes
                .filter((it) => filterNotesContains(it, text))
                .map((it) => getFoundNoteContext(it, text));
            const foundNotebooks = notebooks
                .filter((it) => filterNotebookContains(it, text))
                .map((it) => getFoundNotebookContext(it, text));
            return {
                notes: foundNotes,
                notebooks: foundNotebooks,
            };
        });
        notesController.find = find;

        const user = userEvent.setup();
        const currentState = getSomeNotes(initialState);
        store = configureStore({
            reducer: {
                authReducer: authSlice(initialState.authReducer).reducer,
                notebooksReducer: notesSlice(currentState.notebooksReducer).reducer,
            },
        });
        act(() => {
            render(
                <Provider store={store}>
                    <MemoryRouter>
                        <Routes>
                            <Route path="/" element={<Search />} />
                            <Route
                                path="/:number"
                                element={<Print/>}
                            />
                        </Routes>
                    </MemoryRouter>
                </Provider>,
            );
        });
        const searchContainer = screen.getByTestId('search-container');
        const input = screen.getByTestId('search-input');
        expect(searchContainer).not.toBeNull();
        expect(input).not.toBeNull();

        let noteToFind: string = currentState.notebooksReducer.allNotes[0].content.substring(0, 5);
        await act(async () => {
            await user.click(searchContainer);
            await user.type(input, noteToFind);
        });
        let resultContainer = document.body!.querySelector('.result-container');
        expect(resultContainer).not.toBeNull();
        expect(resultContainer?.textContent).toContain(noteToFind);

        await act(async () => {
            await user.click(resultContainer!);
        });

        let popupContainer = document.body!.querySelector('.popup-container');
        expect(popupContainer).toBeNull();

        await act(async () => {
            await user.click(searchContainer);
        });

        popupContainer = document.body!.querySelector('.popup-container');
        expect(popupContainer).toBeNull();
        expect(document.body.innerHTML).toContain(currentState.notebooksReducer.allNotes[0].id.toString())
    });
});

function getSomeNotes(state: RootState): RootState {
    const result: RootState = {
        authReducer: state.authReducer,
        notebooksReducer: randomNotebookWithNotes(),
    };
    return result;
}

function randomNotebookWithNotes(): { notebooks: INotebook[]; allNotes: INote[] } {
    const notebooks: INotebook[] = [];
    const notes: INote[] = [];
    for (let i = 0; i < 10; i++) {
        notebooks.push(randomNotebook());
    }

    for (let i = 0; i < notebooks.length; i++) {
        for (let j = 0; j < 5; j++) {
            const currentNotebook = notebooks[i];
            notes.push(randomNote(currentNotebook));
        }
    }

    return {
        notebooks: notebooks,
        allNotes: notes,
    };
}

function randomNotebook(): INotebook {
    return {
        color: 'black',
        id: Math.random() * 150,
        name: randomString(),
    };
}

function randomNote(parent: INotebook): INote {
    return {
        content: randomString(),
        id: Math.random() * 100,
        isPublicUrlShared: false,
        isNew: false,
        parent: parent,
        name: randomString(),
        publicUrl: '',
    };
}

function randomString(): string {
    return (Math.random() + 1).toString(36);
}

function filterNotesContains(note: INote, text: string): boolean {
    return note.content.toLowerCase().includes(text.toLowerCase());
}

function getFoundNoteContext(note: INote, text: string): IFoundNote {
    return {
        note,
        context: getContext(note.content, text),
    };
}

function getFoundNotebookContext(notebook: INotebook, text: string): IFoundNotebook {
    return {
        notebook,
        context: getContext(notebook.name, text),
    };
}

const searchContextOffset = 5;
const minSearchContextOffset = 100;

function getContext(content: string, search: string): string {
    const foundIndex = content.toLowerCase().indexOf(search);
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
    return (
        content.substring(indexOfContext, foundIndex) +
        '%%' +
        content.substring(foundIndex, endIndex) +
        '%%' +
        content.substring(endIndex, indexOfEndContext)
    );
}

function filterNotebookContains(notebook: INotebook, text: string): boolean {
    return notebook.name.toLowerCase().includes(text.toLowerCase());
}

function Print() {
    var fromPath = useParams();
    return <div>{fromPath.number}</div>;
}