/* eslint-disable no-undef */
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { PasswordInput } from './passwordInput';

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

describe('test password input component', () => {
    it('can render', () => {
        act(() => {
            root!.render(<PasswordInput id='test-id'/>)
        })
    });

    it('renders key icon', () => {
        act(() => {
            root!.render(<PasswordInput id='test-id'/>)
        })

        const keyIcon = container!.querySelector("svg")
        expect(keyIcon).not.toBeNull()
        expect(keyIcon!.innerHTML).toContain("#key")
    });

    it("matches snapshot", () => {
        act(() => {
            root!.render(<PasswordInput id='test-id'/>)
        })
        expect(container!.firstChild).toMatchSnapshot("Password input test snapshot")
    })

    it("can show and hide password", () => {
        act(() => {
            root!.render(<PasswordInput id='test-id'/>)
        })

        const eyeIcon = container!.querySelector(".eye-icon")
        const input = container!.querySelector("input");
        expect(input).not.toBeNull();
        expect(eyeIcon).not.toBeNull();

        expect(input!.type).toEqual("password")
        expect(eyeIcon?.innerHTML).toContain("#eye-open")

        act(() => {
            eyeIcon?.dispatchEvent(new MouseEvent("click", {bubbles: true}))
        })

        expect(input!.type).toEqual("text")
        expect(eyeIcon?.innerHTML).toContain("#eye-closed")
    })

    it("show error", () => {
        act(()=> {
            root!.render(<PasswordInput id="test-id" error='test-error'/>)
        })

        const expectedInputClassName = "input input-error"
        const errorLabel = container!.querySelector("label")
        expect(errorLabel?.textContent).toEqual("test-error")

        const input = container!.querySelector("input")
        expect(input?.className).toEqual(expectedInputClassName)
    })
});
