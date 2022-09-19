/* eslint-disable no-undef */
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { Loading } from './loading';

//#region common setup
let root: Root | null = null;
let container: Element | null = null;
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
        act(() => {
            root!.render(<Loading />)
        })
        expect(container!.firstChild).toMatchSnapshot("Loading test snapshot")
    })
})