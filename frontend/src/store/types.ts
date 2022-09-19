import { ValidationResult } from "../controllers/types";

export interface User {
    userName: string;
    avatarUrl?: string;
    roles: string[];
}

export interface AuthState {
    isAuth?: boolean;
    isLoaded?: boolean;
    user?: User;
    error: string;
    validation: ValidationResult;
}

export interface NotebooksState {
    notebooks: INotebook[];
    allNotes: INote[];
    selectedTags: string[];
    userTags: string[];
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
    isPublicUrlShared: boolean;
    publicUrl: string;
    tags: string[];
}

export interface INoteDTO {
    id: number;
    name: string;
    content: string;
    notebookId: number;
    isShared: boolean;
    publicUrl: string;
    tags: string[];
}

export interface INotebookWithNotes {
    id: number;
    name: string;
    color: string;
    notes: INote[]
}

export interface INoteSharedState {
    noteId: number;
    isShared: boolean;
}
