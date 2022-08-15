/* eslint-disable no-undef */
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Workfield } from './workfield';
import { INote, INotebook, INoteDTO } from '../../store/types';
import notesController from '../../controllers/NotesController';

jest.mock('../../controllers/NotesController', () => ({
    removeNote: jest.fn(),
    updateNote: jest.fn(),
}));

const notebook: INotebook = {
    color: 'red',
    id: 1,
    name: 'test-notebook',
};
let note: INote = {
    content: 'test-content',
    id: 0,
    isNew: false,
    isPublicUrlShared: false,
    name: 'test-name',
    parent: notebook,
    publicUrl: 'test-public-url',
};

describe('workfield tests', () => {
    test('can render', () => {
        render(<Workfield note={note} />);
        const workfield = document.body.querySelector('.work-field');
        expect(workfield).not.toBeNull();
    });

    test('match snapshot', () => {
        render(<Workfield note={note} />);
        const workfield = document.body.querySelector('.work-field');
        expect(workfield).not.toBeNull();
        expect(workfield?.outerHTML).toMatchSnapshot('workfield snapshot');
    });

    test('can be rendered when note is null', () => {
        render(<Workfield note={null} />);
        const workfield = document.body.querySelector('.work-field');
        expect(workfield).not.toBeNull();
    });

    test('can be rendered when note is undefined', () => {
        render(<Workfield note={undefined} />);
        const workfield = document.body.querySelector('.work-field');
        expect(workfield).not.toBeNull();
    });

    test('helpers bold', async () => {
        render(<Workfield note={note} />);
        const btn = screen.getByTestId('bold-icon');
        expect(btn).not.toBeNull();

        const input = screen.getByTestId('input-field');
        (input as HTMLTextAreaElement).select();

        fireEvent.click(btn);

        expect(input.textContent).toEqual('**test-content**');
    });

    test('helpers italic', () => {
        render(<Workfield note={note} />);
        const btn = screen.getByTestId('italic-icon');
        expect(btn).not.toBeNull();

        const input = screen.getByTestId('input-field');
        (input as HTMLTextAreaElement).select();

        fireEvent.click(btn);

        expect(input.textContent).toEqual('*test-content*');
    });

    test('helpers underscoped', () => {
        render(<Workfield note={note} />);
        const btn = screen.getByTestId('underscoped-icon');
        expect(btn).not.toBeNull();

        const input = screen.getByTestId('input-field');
        (input as HTMLTextAreaElement).select();

        fireEvent.click(btn);

        expect(input.textContent).toEqual('_test-content_');
    });

    test('helpers h1', () => {
        render(<Workfield note={note} />);
        const btn = screen.getByTestId('h1-icon');
        expect(btn).not.toBeNull();

        const input = screen.getByTestId('input-field');
        (input as HTMLTextAreaElement).select();

        fireEvent.click(btn);

        expect(input.textContent).toEqual('# test-content');
    });

    test('helpers h2', () => {
        render(<Workfield note={note} />);
        const btn = screen.getByTestId('h2-icon');
        expect(btn).not.toBeNull();

        const input = screen.getByTestId('input-field');
        (input as HTMLTextAreaElement).select();

        fireEvent.click(btn);

        expect(input.textContent).toEqual('## test-content');
    });

    test('helpers h3', () => {
        render(<Workfield note={note} />);
        const btn = screen.getByTestId('h3-icon');
        expect(btn).not.toBeNull();

        const input = screen.getByTestId('input-field');
        (input as HTMLTextAreaElement).select();

        fireEvent.click(btn);

        expect(input.textContent).toEqual('### test-content');
    });

    test('helpers dotted list', () => {
        render(<Workfield note={note} />);
        const btn = screen.getByTestId('dotted-list-icon');
        expect(btn).not.toBeNull();

        const input = screen.getByTestId('input-field');
        (input as HTMLTextAreaElement).select();

        fireEvent.click(btn);

        expect(input.textContent).toEqual('* test-content');
    });

    test('helpers number list', () => {
        render(<Workfield note={note} />);
        const btn = screen.getByTestId('list-icon');
        expect(btn).not.toBeNull();

        const input = screen.getByTestId('input-field');
        (input as HTMLTextAreaElement).select();

        fireEvent.click(btn);

        expect(input.textContent).toEqual('1. test-content');
    });

    test('helpers table', () => {
        render(<Workfield note={note} />);
        const btn = screen.getByTestId('table-icon');
        expect(btn).not.toBeNull();

        const input = screen.getByTestId('input-field');
        (input as HTMLTextAreaElement).select();

        fireEvent.click(btn);

        expect(input.textContent).toEqual('| column1 | column2 |\n|-----|-----|\n| value | value |\ntest-content');
    });

    test('helpers code', () => {
        render(<Workfield note={note} />);
        const btn = screen.getByTestId('code-icon');
        expect(btn).not.toBeNull();

        const input = screen.getByTestId('input-field');
        (input as HTMLTextAreaElement).select();

        fireEvent.click(btn);

        expect(input.textContent).toEqual('```\ntest-content\n```');
    });

    test('helpers markdown', () => {
        render(<Workfield note={note} />);
        const btn = screen.getByTestId('markup-icon');
        expect(btn).not.toBeNull();

        fireEvent.click(btn);

        const popup = document.querySelector('[data-testid=markdown-help]');
        expect(popup).not.toBeNull();

        expect(popup!.outerHTML).toMatchSnapshot('markdown-help-snapshot');
    });

    test('can delete note', () => {
        let isRemoved = false;
        // eslint-disable-next-line no-unused-vars
        const remove = jest.fn((noteId: number) => {
            isRemoved = true;
        });
        notesController.removeNote = remove;
        render(<Workfield note={note} />);
        const btn = screen.getByTestId('remove');
        expect(btn).not.toBeNull();

        fireEvent.click(btn);

        expect(isRemoved).toBe(true);
    });

    test('can copy note', () => {
        //TODO not implemented yet
        expect(true).toBe(true);
    });

    test('can tag note', () => {
        //TODO not implemented yet
        expect(true).toBe(true);
    });

    test('can go in reader mode', () => {
        render(<Workfield note={note} />);
        const btn = screen.getByTestId('read-icon');
        expect(btn).not.toBeNull();

        fireEvent.click(btn);

        const workfield = document.querySelector('.workfield-content-read-mode');
        expect(workfield).not.toBeNull();

        const editArea = document.querySelector('.reader-mode-invisible');
        expect(editArea).not.toBeNull();

        expect(workfield).toMatchSnapshot('workfield-read-mode');
    });

    test('can save note', () => {
        let isUpdated = false;
        // eslint-disable-next-line no-unused-vars
        const save = jest.fn((_note: INoteDTO) => {
            isUpdated = true;
        });
        notesController.updateNote = save;
        render(<Workfield note={note} />);
        const btn = screen.getByTestId('save-icon');
        expect(btn).not.toBeNull();

        fireEvent.click(btn);

        expect(isUpdated).toBe(true);
    });

    test('can fire onChange', () => {
        let isChanged = false;
        render(<Workfield note={note} onChange={() => (isChanged = true)} />);

        const input = screen.getByTestId('input-field') as HTMLTextAreaElement;
        expect(input).not.toBeNull();
        fireEvent.change(input, { target: { value: 'test-content2' } });

        expect(input.value).toBe('test-content2');
        expect(isChanged).toBe(true);
    });

    test('can fire onSave', () => {
        let isUpdated = false;
        // eslint-disable-next-line no-unused-vars
        const save = jest.fn((_note: INoteDTO) => {
            isUpdated = true;
        });
        notesController.updateNote = save;
        let isOnSaved = false;
        render(<Workfield note={note} onSave={() => (isOnSaved = true)} />);
        const btn = screen.getByTestId('save-icon');
        expect(btn).not.toBeNull();

        fireEvent.click(btn);

        expect(isUpdated).toBe(true);
        expect(isOnSaved).toBe(true);
    });

    test('when save without title then ok', () => {
        let isUpdated = false;
        let title = '';
        // eslint-disable-next-line no-unused-vars
        const save = jest.fn((_note: INoteDTO) => {
            isUpdated = true;
            title = _note.name;
        });
        notesController.updateNote = save;
        render(<Workfield note={note} />);
        const btn = screen.getByTestId('save-icon');
        expect(btn).not.toBeNull();

        const input = screen.getByTestId('input-field') as HTMLTextAreaElement;
        expect(input).not.toBeNull();
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.click(btn);

        expect(isUpdated).toBe(true);
        expect(title).toEqual('Без названия');
    });

    test('it renders on input', () => {
        render(<Workfield note={note} />);
        const input = screen.getByTestId('input-field') as HTMLTextAreaElement;
        const renderedView = screen.getByTestId('pretty-view');
        expect(input.value).toEqual('test-content');

        fireEvent.change(input, { target: { value: '**test-bold**' } });
        expect(renderedView.innerHTML).toEqual('<p><strong>test-bold</strong></p>\n');

        fireEvent.change(input, { target: { value: '*test-italic*' } });
        expect(renderedView.innerHTML).toEqual('<p><em>test-italic</em></p>\n');

        fireEvent.change(input, { target: { value: '_test-underscoped_' } });
        expect(renderedView.innerHTML).toEqual('<p><u>test-underscoped</u></p>\n');

        fireEvent.change(input, { target: { value: '* test-dotted' } });
        expect(renderedView.innerHTML).toEqual('<ul>\n<li>test-dotted</li>\n</ul>\n');

        fireEvent.change(input, { target: { value: '1. test-number' } });
        expect(renderedView.innerHTML).toEqual('<ol>\n<li>test-number</li>\n</ol>\n');

        fireEvent.change(input, { target: { value: '# test-header' } });
        expect(renderedView.innerHTML).toEqual('<h1>test-header</h1>\n');

        fireEvent.change(input, { target: { value: '## test-header' } });
        expect(renderedView.innerHTML).toEqual('<h2>test-header</h2>\n');

        fireEvent.change(input, { target: { value: '### test-header' } });
        expect(renderedView.innerHTML).toEqual('<h3>test-header</h3>\n');

        fireEvent.change(input, { target: { value: '```\ntest-code\n```' } });
        expect(renderedView.innerHTML).toEqual('<pre class="hljs"><code>test-code\n</code></pre>\n');

        const tableInput = '| column1 | column2 |\n' + '|-----|-----|\n' + '| value | value |';
        const tableExpected =
            '<table>\n' +
            '<thead>\n' +
            '<tr>\n' +
            '<th>column1</th>\n' +
            '<th>column2</th>\n' +
            '</tr>\n' +
            '</thead>\n' +
            '<tbody>\n' +
            '<tr>\n' +
            '<td>value</td>\n' +
            '<td>value</td>\n' +
            '</tr>\n' +
            '</tbody>\n' +
            '</table>\n';
        fireEvent.change(input, { target: { value: tableInput } });
        expect(renderedView.innerHTML).toEqual(tableExpected);

        fireEvent.change(input, { target: { value: 'test-row1\ntest-row2' } });
        input.select();
        fireEvent.keyDown(input, { key: 'Tab', code: 'Tab', charCode: 9 });
        expect(input.value).toEqual("    test-row1\n    test-row2");

        fireEvent.keyDown(input, { key: 'Tab', code: 'Tab', charCode: 9, shiftKey: true });
        expect(input.value).toEqual("test-row1\ntest-row2");
    });
});
