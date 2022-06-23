import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Popup from 'reactjs-popup';
import { selectedNote } from '../../../../store/reducers/notebooksReducer';
import Button from '../../../Button';
import SmallButton from '../../../SmallButton';
import { Icons } from '../../../Svg/types';
import styles from './ShareButton.scss';
import rootStyle from '../../../../Misc/root.scss';
import notesController from '../../../../controllers/NotesController';
import properties from '../../../../properties/properties';
import Svg from '../../../Svg';
import clipboardCopy from 'clipboard-copy';

export function ShareButton() {
    const note = useSelector(selectedNote);
    const currentNoteSharedState = note?.isPublicUrlShared ? note.isPublicUrlShared : false;
    const url = `${document.location.origin}/shared/${note?.publicUrl}`;
    const [isShared, setShared] = useState(currentNoteSharedState);

    const handleSaveClick = () => {
        console.log(note!.id);
        notesController.setShared(note!.id, isShared);
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShared(event.target.checked);
    };

    const handleCopy = () => {
        clipboardCopy(url);
    }

    return (
        <Popup
            trigger={
                <div>
                    <SmallButton icon={Icons.Share} tooltip="Поделиться" />
                </div>
            }
            modal
            closeOnDocumentClick>
            {(close) => {
                return (
                    <div className={styles['popup-container']}>
                        <div className={styles["input-wrapper"]} title="Нажмите что бы скопировать" onClick={handleCopy}>
                            <span className={styles['public-url-container']}>{url}</span>
                            <Svg icon={Icons.Copy} className={styles["copy-ico"]}/>
                        </div>
                        <div className={rootStyle['checkbox-container']}>
                            <input
                                type="checkbox"
                                id="share-checkbox"
                                defaultChecked={currentNoteSharedState}
                                className={rootStyle['checkbox-common']}
                                onChange={handleCheckboxChange}
                            />
                            <label htmlFor="share-checkbox" className={rootStyle['checkbox-common-label']}>
                                Предоставить общий доступ по ссылке
                            </label>
                        </div>
                        <Button
                            title="Сохранить"
                            onClick={() => {
                                handleSaveClick();
                                close();
                            }}
                        />
                    </div>
                );
            }}
        </Popup>
    );
}
