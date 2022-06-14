/* eslint-disable no-unused-vars */
import { INote } from "../../store/types";

export interface INoteProps{
    note: INote;
    onClick?: (note: INote) => void;
    isSelected?: boolean;
}
