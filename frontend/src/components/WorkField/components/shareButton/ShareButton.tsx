import React from 'react';
import Popup from 'reactjs-popup';
import Button from '../../../Button';
import SmallButton from '../../../SmallButton';
import { Icons } from '../../../Svg/types';
import styles from './ShareButton.scss';
import notesController from '../../../../controllers/NotesController';
import Svg from '../../../Svg';
import clipboardCopy from 'clipboard-copy';
import { toast } from 'react-toastify';
import Checkbox from '../../../Checkbox';
import IShareBtnProps from './types';

export function ShareButton(props: IShareBtnProps) {
    const {note} = props;
    const currentNoteSharedState = note?.isPublicUrlShared ? note.isPublicUrlShared : false;
    const url = `${document.location.origin}/shared/${note?.publicUrl}`;
    let isShared = currentNoteSharedState;
    const setShared = (value: boolean) => {
        isShared = value;
    };

    const handleSaveClick = () => {
        notesController.setShared(note!.id, isShared);
    };

    const handleCopy = () => {
        clipboardCopy(url);
        toast.success('Ссылка скопирована', { autoClose: 1000 });
    };

    return (
        <Popup
            trigger={
                <div>
                    <SmallButton icon={Icons.Share} tooltip="Поделиться" />
                </div>
            }
            disabled={note === undefined || note === null}
            position="bottom right">
            {(close) => {
                return (
                    <div className={styles['popup-container']}>
                        <div
                            className={styles['input-wrapper']}
                            title="Нажмите что бы скопировать"
                            onClick={handleCopy}>
                            <span className={styles['public-url-container']}>{url}</span>
                            <Svg icon={Icons.Copy} className={styles['copy-ico']} />
                        </div>
                        <Checkbox
                            id="share"
                            className={styles['share-checkbox']}
                            defaultValue={currentNoteSharedState}
                            onChanged={(newValue) => setShared(newValue)}
                            title="Предоставить доступ по ссылке"
                        />

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
