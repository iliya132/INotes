/* eslint-disable no-undef */
import React from 'react';
import { MediumButton } from './MediumButton';
import { act } from 'react-dom/test-utils';
import { Icons } from '../Svg/types';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';

describe('Test Button component', () => {
    it('can be rendered', () => {
        act(() => {
            render(<MediumButton title="test" icon={Icons.Dots} />);
        });

        let btn = document.body.querySelector('.medium-container');
        expect(btn).not.toBeNull();

        expect(btn!.textContent).toEqual('test');
        expect(btn).toMatchSnapshot('button-snapshot');
    });

    it('can call events on click', async () => {
        let isPressed = false;
        const user = userEvent.setup();
        const testCallback = () => (isPressed = true);
        act(() => {
            render(<MediumButton title="test" icon={Icons.Dots} onClick={testCallback} />);
        });

        let btn = document.body.querySelector('.medium-container');
        expect(btn).not.toBeNull();

        await act(async () => {
            await user.click(btn!);
        })

        expect(isPressed).toEqual(true);
    });

    it('setup className', () => {
        const className = 'test-classname';
        const expectedClassName = 'medium-container test-classname';
        act(() => {
            render(<MediumButton title="test" icon={Icons.Dots} className={className} />);
        });

        expect(document.body.innerHTML).toContain(expectedClassName);
    });

    it('should be disabled when disabled props is set', async () => {
        const user = userEvent.setup();
        let isPressed = false;
        const testCallback = () => (isPressed = true);
        act(() => {
            render(<MediumButton title="test" icon={Icons.Dots} onClick={testCallback} disabled={true} />);
        });

        let btn = document.body.querySelector('.medium-container');
        expect(btn).not.toBeNull();

        await act(async () => {
            await user.click(btn!);
        })

        expect(isPressed).toEqual(false);
    });

    it('should render title', () => {
        act(() => {
            render(<MediumButton title="test" icon={Icons.Dots} />);
        });
        let btn = document.body.querySelector('.medium-container');
        expect(btn).not.toBeNull();

        expect(btn).not.toBeNull();
        expect(btn!.textContent).toEqual('test');
    });
});
