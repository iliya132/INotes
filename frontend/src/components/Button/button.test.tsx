/* eslint-disable no-undef */
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Button } from './button';
import { act } from 'react-dom/test-utils';


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

describe('Test Button component', () => {
    it('can be rendered', () => {
        act(() => {
            root!.render(<Button title="test" />);
        });

        let btn = container?.querySelector('button');

        expect(btn!.textContent).toEqual('test');
        expect(btn).toMatchSnapshot('button-snapshot');
    });

    it('can call events on click', () => {
        let isPressed = false;
        const testCallback = () => (isPressed = true);
        act(() => {
            const button = <Button title="test" onClick={testCallback} />;
            button.props.onClick();
        });

        expect(isPressed).toEqual(true);
    });

    it('setup className', () => {
        const className = 'test-classname'
        const expectedClassName = 'primary-button test-classname';
        act(() => {
            root!.render(<Button title="test" className={className} />);
        });
        let btn = container?.querySelector('button');

        expect(btn!.className).toEqual(expectedClassName);
    });

    it('shows loading when isLoading', () => {
        act(() => {
            root!.render(<Button title="test" isLoading={true} />);
        });
        let btn = container?.querySelector('button');
        expect(btn!.childNodes[1]).toMatchSnapshot('button-loading-snapshot');
    });

    it('should be disabled when disabled props is set', () => {
        act(() => {
            root!.render(<Button title="test" disabled={true} />);
        });
        let btn = container?.querySelector('button');
        expect(btn!.outerHTML).toContain('disabled');
    });
});
