/* eslint-disable no-undef */
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { Icons } from '../Svg/types';
import { Input } from './Input';

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
            root!.render(<Input id='test-id' type="text" icon={Icons.Key} />)
        })
        expect(container!.firstChild).toMatchSnapshot("Input test snapshot")
    })

    it("should render icon when provided", () => {
        act(() => {
            root!.render(<Input id='test-id' type="text" icon={Icons.Key} />)
        })
        const svg = container!.querySelector("svg")
        expect(svg).not.toBeNull()
        expect(svg?.outerHTML).toContain("#key")
    })

    it("should show error when provided", () =>{
        act(()=> {
            root!.render(<Input id="test-id" error='test-error' type="text"/>)
        })

        const expectedInputClassName = "input input-error"
        const errorLabel = container!.querySelector("label")
        expect(errorLabel?.textContent).toEqual("test-error")

        const input = container!.querySelector("input")
        expect(input?.className).toEqual(expectedInputClassName)
    })
})