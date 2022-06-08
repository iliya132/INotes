package ru.iliya132.inotes.dto

data class NoteDTO(
    val id: Long,
    val name: String,
    val content: String,
    val notebookId: Long
)