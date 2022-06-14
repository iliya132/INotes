package ru.iliya132.inotes.dto

import ru.iliya132.inotes.models.base.BaseEntity

data class NoteDTO(
    override val id: Long,
    val name: String,
    val content: String,
    val notebookId: Long
) : IValidatedEntity, BaseEntity {
    override fun validate(): Boolean {
        return name.isNotEmpty()
    }
}
