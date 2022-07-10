/* eslint-disable no-unused-vars */
import { INote } from "../../store/types";

export interface IWorkfieldProps {
    note: INote | null | undefined;
    onChange?: () => void;
    onSave?: () => void;
}

export enum WfAction {
    Bold,
    Italic,
    Underscoped,
    Dotted,
    Number,
    H1,
    H2,
    H3,
    Code,
    Table
}
