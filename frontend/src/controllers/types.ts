import { INote, INotebook } from "../store/types";

export interface ValidationResult {
    isSucceded: boolean,
    errors: any
}

export interface NotebookDTO {
    id: number,
    name: string,
    color: string
}

export interface NoteDTO {
    id: number;
    name: string;
    content: string;
    parent: number;
    isNew: boolean
}

export interface PasswordChange {
    currentPassword: string,
    newPassword: string,
    newPasswordConfirm: string
}

export interface PasswordChangeResponse {
    isSuccessfull: boolean;
    errors: { targets: string[], message: string }
}

export interface ISearchResult {
    notebooks: IFoundNotebook[];
    notes: IFoundNote[];
}

export interface IFoundNote {
    note: INote;
    context: string;
}

export interface IFoundNotebook{
    notebook: INotebook;
    context: string;
}
