/* eslint-disable no-undef */
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Checkbox } from './Checkbox';
import { act } from 'react-dom/test-utils';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

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

describe('Test Checkbox component', () => {
    it('can be rendered', () => {
        act(() => {
            root!.render(<Checkbox id="test-id" title="test" />);
        });

        let checkboxSpan = container!.querySelector('span');

        expect(checkboxSpan!.textContent).toEqual('test');
        expect(checkboxSpan).toMatchSnapshot('checkbox-snapshot');
    });

    it('can call events on click', () => {
        let isPressed = false;
        act(() => {
            root!.render(<Checkbox id="test-id" title="test" onChanged={(newValue) => (isPressed = newValue)} />);
        });
        const checkbox = container!.childNodes[0];
        act(() => {
            checkbox!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        expect(isPressed).toEqual(true);
    });

    it('setup className', () => {
        const expectedClassName = 'test-classname';
        act(() => {
            root!.render(<Checkbox id="test-id" title="test" className={expectedClassName} />);
        });
        let checkboxStyledContainer = container?.querySelector(`.${expectedClassName}`);

        expect(checkboxStyledContainer).not.toBeNull();
        expect(checkboxStyledContainer!.className).toContain(expectedClassName);
    });

    it('display check svg on preess', () => {
        act(() => {
            root!.render(<Checkbox id="test-id" title="test" />);
        });
        const checkbox = container!.childNodes[0];
        act(() => {
            checkbox!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        const checkBoxElement = container?.querySelector('div');
        expect(checkBoxElement?.innerHTML).toContain('#check');
        expect(checkBoxElement?.innerHTML).toContain('<svg');
        expect(checkBoxElement!.innerHTML).toMatchSnapshot("checkbox-pressed")
    });

    it('not pressed by default', () => {
        act(() => {
            root!.render(<Checkbox id="test-id" title="test" />);
        });
        const checkBoxElement = container?.querySelector('div');
        expect(checkBoxElement!.innerHTML).toMatchSnapshot("checkbox-unpressed")
    });
});
