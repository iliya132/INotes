import { ValidationResult } from "../controllers/types";

export interface User {
    userName: string;
    avatar?: string;
    roles: string[];
}

export interface AuthState {
    isAuth?: boolean;
    user?: User;
    error: string;
    validation: ValidationResult;
}

export interface NotebooksState {
    selectedNotebook?: INotebook;
    notebooks: INotebook[];
    allNotes: INote[];
    currentNotebookNotes: INote[];
    selectedNote?: INote;
}

export interface INotebook {
    id: number;
    name: string;
    color: string;
}

export interface INote {
    id: number;
    name: string;
    content: string;
    parent: INotebook;
    isNew: boolean;
}

export interface INoteDTO {
    id: number;
    name: string;
    content: string;
    notebookId: number;
}

export interface INotebookWithNotes {
    id: number;
    name: string;
    color: string;
    notes: INote[]
}
