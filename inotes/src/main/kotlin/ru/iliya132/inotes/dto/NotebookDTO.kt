package ru.iliya132.inotes.dto

data class NotebookDTO(
    val id: Long,
    val name: String,
    val color: String,
    val owner: Long
)