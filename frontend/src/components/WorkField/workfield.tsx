import React, { useEffect, useRef, useState } from 'react';
import SmallButton from '../SmallButton';
import { Icons } from '../Svg/types';
import { IWorkfieldProps, WfAction } from './types';
import styles from './workfield.scss';
import PrettyMarkup from '../PrettyMarkup';
import notesController from '../../controllers/NotesController';
import { INoteDTO } from '../../store/types';
import { MediumButton } from '../SmallButton/MediumButton';
import classNames from 'classnames';
import { ShareButton } from './components/shareButton/ShareButton';
import configureMarkdownIt from '../../Misc/utils/configureMarkdown';
import Popup from 'reactjs-popup';

export function Workfield(props: IWorkfieldProps) {
    const { note, onChange, onSave } = props;
    const [currentNoteId, setCurrentNoteId] = useState(-1);
    const [rendered, setRendered] = useState('');
    const [input, setInput] = useState(note?.content);
    const [isReadMode, setReadMode] = useState(false);

    const textAreaRef: React.LegacyRef<HTMLTextAreaElement> = useRef(null);
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
            setInput('');
            setRendered('');
            textAreaRef.current!.value = '';
        }
    });

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        handleTextAreaValueChanged(setRendered, setInput, md)(event);
        if (onChange) {
            onChange();
        }
    };

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
        if (len === 0) {
            st = startPos;
            end = startPos;
        }
        textAreaElem.select();
        textAreaElem.setSelectionRange(st, end);
        render(result);
    };

    const handleSwitchReadMode = () => {
        setReadMode(!isReadMode);
    };

    const handleNoteRemove = () => {
        if (note) {
            notesController.removeNote(note?.id);
        }
    };

    const handleSaveChanges = () => {
        if (note) {
            const noteToUpdate: INoteDTO = {
                content: input!,
                id: note.id,
                name: getTitle(input!),
                notebookId: note?.parent.id,
                isShared: note.isPublicUrlShared,
                publicUrl: note.publicUrl
            };
            notesController.updateNote(noteToUpdate);
        }
        if (onSave) {
            onSave();
        }
    };

    const handleNotecopy = () => {
        if(note) {
            const noteToUpdate: INoteDTO = {
                content: input!,
                id: 0,
                name: getTitle(input!),
                notebookId: note?.parent.id,
                isShared: note.isPublicUrlShared,
                publicUrl: note.publicUrl
            };
            notesController.copyNote(noteToUpdate);
        }
    }

    function getTitle(content: string) {
        const contentSplitted = content.replace(/#/g, '').replace(/_/g, '').trim().split('\n');
        if (contentSplitted.length > 0 && contentSplitted[0].length > 0) {
            return contentSplitted[0];
        } else {
            return 'Без названия';
        }
    }

    return (
        <div className={styles['work-field']}>
            <div className={styles['workfield-actions']}>
                {!isReadMode ? (
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
                            data-testid="btn-underscoped"
                            className={styles['wf-action-btn']}
                            icon={Icons.Underscoped}
                            onClick={() => handleWfAction(WfAction.Underscoped)}
                        />
                        <SmallButton
                            size={15}data-testid="btn-dottedlist"
                            className={styles['wf-action-btn']}
                            icon={Icons.DottedList}
                            onClick={() => handleWfAction(WfAction.Dotted)}
                        />
                        <SmallButton
                            size={15}
                            data-testid="btn-numberlist"
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
                            data-testid="btn-code"
                            className={styles['wf-action-btn']}
                            icon={Icons.Code}
                            onClick={() => handleWfAction(WfAction.Code)}
                        />
                        <SmallButton
                            size={15}
                            data-testid="btn-table"
                            className={styles['wf-action-btn']}
                            icon={Icons.Table}
                            onClick={() => handleWfAction(WfAction.Table)}
                        />
                        <Popup
                            trigger={
                                <div>
                                    <SmallButton size={15} className={styles['wf-action-btn']} icon={Icons.Markup} />
                                </div>
                            }>
                            <div className={styles["markdown-help-container"]} data-testid="markdown-help">
                                <ul>
                                    <li>Жирный текст <div className={styles["markdown-help-container-example"]}>**Text**</div></li><hr/>
                                    <li>Курсивный текст <div className={styles["markdown-help-container-example"]}>*Text*</div></li><hr/>
                                    <li>Подчеркнутый текст <div className={styles["markdown-help-container-example"]}>_Text_</div></li><hr/>
                                    <li>Заголовок 1 уровня <div className={styles["markdown-help-container-example"]}># Text</div></li><hr/>
                                    <li>Заголовок 2 уровня <div className={styles["markdown-help-container-example"]}>## Text</div></li><hr/>
                                    <li>Заголовок 3 уровня <div className={styles["markdown-help-container-example"]}>### Text</div></li><hr/>
                                    <li>Список с точками <div className={styles["markdown-help-container-example"]}>* Text</div></li><hr/>
                                    <li>Список с цифрами <div className={styles["markdown-help-container-example"]}>1. Text</div></li><hr/>
                                    <li>Блок кода <div className={styles["markdown-help-container-example"]}>``` javascript <br/> Text <br/>```</div></li><hr/>
                                    <li>Однострочный код <div className={styles["markdown-help-container-example"]}>`Text`</div></li><hr/>
                                    <li>Таблица <div className={styles["markdown-help-container-example"]}>
                                        | header1 | header2 | <br/> |-----|-----| <br/>| value1 | value2 |</div></li><hr/>
                                    <li>Ссылка <div className={styles["markdown-help-container-example"]}>[shown text](http://link_here.com)</div></li><hr/>
                                    <li>Горизонтальная линия <div className={styles["markdown-help-container-example"]}>---</div></li><hr/>
                                    <li>Цитирование <div className={styles["markdown-help-container-example"]}> Text</div></li><hr/>
                                </ul>
                            </div>
                        </Popup>
                    </div>
                ) : null}

                <div className={styles['workfield-actions-container']}>
                    <SmallButton icon={Icons.Remove} onClick={handleNoteRemove} tooltip="Удалить заметку"/>
                    <SmallButton icon={Icons.Copy} onClick={handleNotecopy} tooltip="Скопировать заметку" data-testid="btn-copy"/>
                    <SmallButton icon={Icons.Tag} tooltip="Задать тэг" data-testid="btn-tag"/>
                    <div>
                        <ShareButton note={note} data-testid="btn-share"/>
                    </div>
                    <SmallButton icon={Icons.Read} tooltip="Режим чтения" onClick={handleSwitchReadMode} data-testid="btn-read"/>
                    <MediumButton icon={Icons.Save} onClick={handleSaveChanges} title="Сохранить" data-testid="btn-save"/>
                </div>
            </div>

            <div className={!isReadMode ? styles['workfield-content'] : styles['workfield-content-read-mode']}>
                <div
                    className={classNames(
                        styles['workfield-content-edit-field'],
                        isReadMode ? styles['reader-mode-invisible'] : null,
                    )}>
                    <div className={styles['workfield-content-edit-field-textarea']} key={`text-area${note?.id}`}>
                        <textarea
                            data-testid="input-field"
                            onChange={(event) => handleChange(event)}
                            onKeyDown={handleKeyDown}
                            ref={textAreaRef}
                            disabled={!note}
                            defaultValue={input}></textarea>
                    </div>
                </div>
                <PrettyMarkup renderedValue={rendered} className={isReadMode ? styles['render-mode'] : undefined} />
            </div>
        </div>
    );
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
