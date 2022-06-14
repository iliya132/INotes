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
