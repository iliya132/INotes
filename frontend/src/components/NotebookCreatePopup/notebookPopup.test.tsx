/* eslint-disable no-undef */
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import { NotebookPopup } from './NotebookPopup';

//#region common setup
let root: Root | null = null;
let container: Element | null = null;
let answers: string[] = [];
jest.mock('../../controllers/NotesController', () => {
    return{
        createNotebook: (title: string) => {answers.push(title)}
    }
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

describe('notebook popup tests', () => {
    it('can be rendered', () => {
        act(() => {
            root!.render(<NotebookPopup afterClick={() => {}} />);
        });
    });

    it('matches snapshot', () => {
        act(() => {
            root!.render(<NotebookPopup afterClick={() => {}} />);
        });

        const popupContainer = container!.querySelector('.notebook-create-popup-container');
        expect(popupContainer).toMatchSnapshot('notebook-popup-snapshot');
    });

    it('contains input', () => {
        act(() => {
            root!.render(<NotebookPopup afterClick={() => {}} />);
        });

        const input = container!.querySelector('input');
        expect(input).not.toBeNull();
        expect(input!.placeholder).toEqual('Введите имя для новой записной книжки');
        expect(input!.id).toEqual('notebook-name');
        expect(input!.type).toEqual('text');
    });

    it('call callback on button pressed', () => {
        let isClicked = false;
        act(() => {
            root!.render(
                <NotebookPopup
                    afterClick={() => {
                        isClicked = true;
                    }}
                />,
            );
        });

        expect(isClicked).toEqual(false);
        const btnElement = container!.querySelector('button');
        expect(btnElement).not.toBeNull();

        act(() => {
            btnElement?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        expect(isClicked).toEqual(true);
    });

    it('calls notesController.createNotebook', async () => {
        const user = userEvent.setup();

        act(() => {
            root!.render(<NotebookPopup afterClick={() => {}} />);
        });

        const input = container?.querySelector('input')!;
        const btn = container!.querySelector('button')!;

        await act(async () => {
            await user.click(input);
            await user.keyboard("test-input");
            await user.click(btn);
        });

        expect(input.value).toEqual("test-input");
        expect(answers).toContain('test-input');
    });
});
