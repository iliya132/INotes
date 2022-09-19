import React, { useState } from "react";
import Popup from "reactjs-popup";
import SmallButton from "../../../SmallButton";
import { Icons } from "../../../Svg/types";
import ITagButtonProps, { ITag } from "./types";
import styles from './styles.scss';
import { OnChangeValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { INote } from "../../../../store/types";
import notesController from "../../../../controllers/NotesController";
import { useSelector } from "react-redux";
import { userTags } from "../../../../store/reducers/notebooksReducer";

export function TagButton(props: ITagButtonProps) {
    const { note } = props;
    if (!note) {
        return <></>;
    }
    const availableTags = useSelector(userTags)
    const selectedTags: ITag[] = note?.tags?.map(it => { return { label: it, value: it } })
    const options: ITag[] = availableTags?.map(it => { return { label: it, value: it } })

    const handleChange = (
        newValue: OnChangeValue<ITag, true>
    ) => {
        const val = newValue.map(it => it)
        const noteCopy: INote = { ...note, tags: val.map(it => it.value) };
        notesController.updateTags(noteCopy);
    };

    return (
        <Popup
            trigger={
                <div>
                    <SmallButton icon={Icons.Tag} tooltip="Задать тэг" data-testid="btn-tag" />
                </div>
            }
            disabled={note === undefined || note === null}
            position="bottom right">
            {(close) => {
                return (
                    <div className={styles["popup-container"]}>
                        <CreatableSelect
                            isMulti
                            hideSelectedOptions={false}
                            defaultValue={selectedTags}
                            onChange={handleChange}
                            options={options}
                        />
                    </div>
                )
            }}
        </Popup>
    )
}
