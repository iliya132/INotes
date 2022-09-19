/* eslint-disable no-undef */
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { INote } from '../../../../store/types';
import { configureStore } from '@reduxjs/toolkit';
import { TagButton } from './TagButton';
import { RootState } from '../../../../store/store';
import { authSlice } from '../../../../store/reducers/authReducer';
import { notesSlice } from '../../../../store/reducers/notebooksReducer';
import { Provider } from 'react-redux';

//#region common setup
let root: Root | null = null;
let container: Element | null = null;

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
        userTags: [],
        selectedTags: []
    },
};

let store = configureStore({
    reducer: {
        authReducer: authSlice(initialState.authReducer).reducer,
        notebooksReducer: notesSlice(initialState.notebooksReducer).reducer,
    },
});

beforeEach(() => {
    act(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        root = createRoot(container);
    });
});

afterEach(() => {
    act(() => {
        root!.unmount();
        container!.remove();
        container = null;
    });
});
//#endregion

describe("test  input component", () => {
    it("matches snapshot", () => {
        const testNote:INote = {
            content: 'test',
            id: 0,
            isNew: false,
            isPublicUrlShared: false,
            name: 'test',
            parent: {color: 'red', id: 0, name: 'test'},
            publicUrl: 'url',
            tags: ['tag1', 'tag2']
        }
        act(() => {
            root!.render(<Provider store={store}><TagButton note={testNote} /></Provider>)
        })
        expect(container!.firstChild).toMatchSnapshot("Input test snapshot")
    })
})