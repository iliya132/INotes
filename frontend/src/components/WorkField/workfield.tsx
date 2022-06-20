import React, { useEffect, useRef, useState } from 'react';
import Button from '../Button';
import SmallButton from '../SmallButton';
import { Icons } from '../Svg/types';
import { IWorkfieldProps, WfAction } from './types';
import styles from './workfield.scss';
import markdown from 'markdown-it';
import underline from 'markdown-it-underline';
import hightlightjs from 'highlight.js';
import 'highlight.js/styles/github.css';
import PrettyMarkup from '../PrettyMarkup';
import notesController from '../../controllers/NotesController';
import { INoteDTO } from '../../store/types';

export function Workfield(props: IWorkfieldProps) {
    const { note, onChange, onSave } = props;
    const name = note ? note.name : '';
    const [currentNoteId, setCurrentNoteId] = useState(-1);
    const [rendered, setRendered] = useState('');
    const [input, setInput] = useState(note?.content);

    const textAreaRef: React.LegacyRef<HTMLTextAreaElement> = useRef(null);
    const nameRef: React.LegacyRef<HTMLInputElement> = useRef(null);
    const md = configureMarkdownIt();
    useEffect(() => {
        if (props.note) {
            if (currentNoteId !== props.note.id) {
                setInput(note!.content);
                const textAreaElem = textAreaRef.current as unknown as HTMLTextAreaElement;
                textAreaElem.value = note!.content;
                setRendered(md.render(note?.content!));
                setCurrentNoteId(props.note.id);
            }
        } else {
            console.log('def');
            setInput('');
            setRendered('');
            textAreaRef.current!.value = '';
        }
    });

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        handleTextAreaValueChanged(setRendered, setInput, md)(event);
        if(onChange){
            onChange();
        }
    }

    const render = (text: string) => {
        setInput(text);
        setRendered(md.render(text));
    };

    const handleKeyDown = handleTextAreaKeyDown(textAreaRef, input, render);

    const handleWfAction = (strategy: WfAction) => {
        const textAreaElem = textAreaRef!.current!;
        const startPos = textAreaElem.selectionStart;
        const EndPos = textAreaElem.selectionEnd;
        const len = EndPos - startPos;
        const selectedValue = textAreaElem?.value.substring(startPos, EndPos);
        const startValue = textAreaElem?.value.substring(0, startPos);
        const endValue = textAreaElem?.value.substring(EndPos);
        const result = startValue + processText(strategy, selectedValue) + endValue;
        textAreaElem.value = result;
        let st = textAreaElem.value.indexOf(selectedValue);
        let end = st + len;
        console.log(st, end, len);
        if (len === 0) {
            st = startPos;
            end = startPos;
        }
        textAreaElem.select();
        textAreaElem.setSelectionRange(st, end);
        render(result);
    };

    const handleNoteRemove = () => {
        if(note){
            notesController.removeNote(note?.id);
        }
    }

    const handleSaveChanges = () => {
        if (note && nameRef?.current) {
            console.log(input);
            const noteToUpdate: INoteDTO = {
                content: input!,
                id: note.id,
                name: nameRef.current.value,
                notebookId: note?.parent.id,
            };
            notesController.updateNote(noteToUpdate);
        }
        if(onSave){
            onSave();
        }
    };

    return (
        <div className={styles['work-field']}>
            <div className={styles['workfield-actions']}>
                <div key={`name-container ${note?.id}`}>
                    <input
                        className={styles['note-name-edit-field']}
                        type="text"
                        autoComplete="disabled"
                        placeholder={!note ? '' : 'Введите название заметки'}
                        id="note-name"
                        defaultValue={name}
                        ref={nameRef}
                        disabled={!note}
                    />
                </div>
                <div className={styles['workfield-actions-container']}>
                    <SmallButton icon={Icons.Pencil} />
                    <SmallButton icon={Icons.Copy} />
                    <SmallButton icon={Icons.Tag} />
                    <SmallButton icon={Icons.Share} />
                    <SmallButton icon={Icons.Remove} onClick={handleNoteRemove}/>
                </div>
            </div>
            <div className={styles['workfield-content']}>
                <div className={styles['workfield-content-edit-field']}>
                    <div className={styles['workfield-content-edit-field-actions']}>
                        <SmallButton
                            size={15}
                            className={styles['wf-action-btn']}
                            icon={Icons.Bold}
                            onClick={() => handleWfAction(WfAction.Bold)}
                        />
                        <SmallButton
                            size={15}
                            className={styles['wf-action-btn']}
                            icon={Icons.Italic}
                            onClick={() => handleWfAction(WfAction.Italic)}
                        />
                        <SmallButton
                            size={15}
                            className={styles['wf-action-btn']}
                            icon={Icons.Underscoped}
                            onClick={() => handleWfAction(WfAction.Underscoped)}
                        />
                        <SmallButton
                            size={15}
                            className={styles['wf-action-btn']}
                            icon={Icons.DottedList}
                            onClick={() => handleWfAction(WfAction.Dotted)}
                        />
                        <SmallButton
                            size={15}
                            className={styles['wf-action-btn']}
                            icon={Icons.NumberList}
                            onClick={() => handleWfAction(WfAction.Number)}
                        />
                        <SmallButton
                            size={15}
                            className={styles['wf-action-btn']}
                            icon={Icons.H1}
                            onClick={() => handleWfAction(WfAction.H1)}
                        />
                        <SmallButton
                            size={15}
                            className={styles['wf-action-btn']}
                            icon={Icons.H2}
                            onClick={() => handleWfAction(WfAction.H2)}
                        />
                        <SmallButton
                            size={15}
                            className={styles['wf-action-btn']}
                            icon={Icons.H3}
                            onClick={() => handleWfAction(WfAction.H3)}
                        />
                        <SmallButton
                            size={15}
                            className={styles['wf-action-btn']}
                            icon={Icons.Code}
                            onClick={() => handleWfAction(WfAction.Code)}
                        />
                        <SmallButton
                            size={15}
                            className={styles['wf-action-btn']}
                            icon={Icons.Table}
                            onClick={() => handleWfAction(WfAction.Table)}
                        />
                        <SmallButton size={15} className={styles['wf-action-btn']} icon={Icons.Markup} />
                    </div>
                    <div className={styles['workfield-content-edit-field-textarea']} key={`text-area${note?.id}`}>
                        <textarea
                            onChange={(event) => handleChange(event)}
                            onKeyDown={handleKeyDown}
                            ref={textAreaRef}
                            disabled={!note}
                            defaultValue={input}></textarea>
                    </div>
                </div>
                <PrettyMarkup renderedValue={rendered} />
            </div>
            <div className={styles['workfield-buttons']}>
                <Button title="Отложить изменения" className={styles['stash-changes-btn']} />
                <Button
                    title="Сохранить изменения"
                    className={styles['apply-changes-btn']}
                    onClick={handleSaveChanges}
                />
            </div>
        </div>
    );
}
function configureMarkdownIt() {
    return new markdown({
        html: true,
        linkify: true,
        typographer: true,
        highlight: function (str, lang) {
            if (lang && hightlightjs.getLanguage(lang)) {
                try {
                    return (
                        `<pre class="hljs ${lang ? `language-${lang}` : null}"><code>` +
                        hightlightjs.highlightAuto(str).value +
                        `</code></pre>`
                    );
                } catch (ex) {
                    console.debug(ex);
                }
            }
            return '<pre class="hljs"><code>' + markdown().utils.escapeHtml(str) + '</code></pre>';
        },
    }).use(underline);
}

function handleTextAreaValueChanged(
    setRendered: React.Dispatch<React.SetStateAction<string>>,
    setInput: React.Dispatch<React.SetStateAction<string | undefined>>,
    md: any,
) {
    return (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRendered(md.render(event.target.value));
        setInput(event.target.value);
    };
}

function handleTextAreaKeyDown(
    textAreaRef: React.LegacyRef<HTMLTextAreaElement>,
    input: string | undefined,
    // eslint-disable-next-line no-unused-vars
    renderFunc: (text: string) => void,
) {
    //TODO refactor this
    return (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            const textAreaElem = textAreaRef!.current;
            const startPos = textAreaElem.selectionStart;
            const EndPos = textAreaElem.selectionEnd;
            if (startPos === EndPos) {
                textAreaElem.value =
                    textAreaElem.value.substring(0, startPos) + '    ' + textAreaElem.value.substring(startPos);
                textAreaElem.selectionStart = startPos + 4;
                textAreaElem.selectionEnd = startPos + 4;
                return;
            }
            const value = textAreaElem.value;
            const valueFromInput = input;
            console.log(valueFromInput);
            const editedPart = value.substring(startPos, EndPos);
            let resultStr = '';
            const lines = editedPart.split('\n');
            let resultCaretPos = EndPos;
            if (!event.shiftKey) {
                for (let lineIndex in lines) {
                    resultStr += '    ' + lines[lineIndex] + '\n';
                    resultCaretPos += 4;
                }
            } else {
                for (let lineIndex in lines) {
                    if (lines[lineIndex].startsWith('    ')) {
                        resultStr += lines[lineIndex].substring(4) + '\n';
                        resultCaretPos -= 4;
                    }
                }
            }
            const trimmed = resultStr.trimEnd();
            const result = textAreaElem.value.substring(0, startPos) + trimmed + textAreaElem.value.substring(EndPos);

            textAreaElem.value = result;

            textAreaElem.selectionStart = startPos != EndPos ? startPos : resultCaretPos;
            textAreaElem.selectionEnd = resultCaretPos;
            renderFunc(result);
        }
    };
}

function processText(action: WfAction, text: string) {
    switch (action) {
        case WfAction.Bold:
            return `**${text}**`;
        case WfAction.Italic:
            return `*${text}*`;
        case WfAction.Underscoped:
            return `_${text}_`;
        case WfAction.Dotted:
            return `* ${text}`;
        case WfAction.Number:
            return `1. ${text}`;
        case WfAction.H1:
            return `# ${text}`;
        case WfAction.H2:
            return `## ${text}`;
        case WfAction.H3:
            return `### ${text}`;
        case WfAction.Code:
            return `\`\`\`\n${text}\n\`\`\``;
        case WfAction.Table:
            return `| column1 | column2 |\n|-----|-----|\n| value | value |\n${text}`;
        default:
            return text;
    }
}
