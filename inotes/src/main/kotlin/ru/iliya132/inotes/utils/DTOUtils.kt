package ru.iliya132.inotes.utils

import ru.iliya132.inotes.dto.NoteDTO
import ru.iliya132.inotes.dto.NotebookDTO
import ru.iliya132.inotes.models.Note
import ru.iliya132.inotes.models.Notebook

fun NoteDTO.fromDTO(): Note {
    return Note(this.id, this.name, this.notebookId, this.content, this.isPublicUrlShared, this.publicUrl)
}

fun Note.toDto(): NoteDTO {
    return NoteDTO(this.id, this.name, this.content, this.notebook, this.isPublicUrlShared, this.publicId, arrayListOf())
}

fun NotebookDTO.fromDTO(): Notebook {
    return Notebook(this.id, this.name, this.owner, this.color)
}

fun Notebook.toDTO(): NotebookDTO {
    return NotebookDTO(this.id, this.name, this.color, this.owner)
}