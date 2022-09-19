package ru.iliya132.inotes.dto

import ru.iliya132.inotes.models.base.BaseEntity

data class NoteDTO(
    override val id: Long,
    val name: String,
    val content: String,
    val notebookId: Long,
    val isPublicUrlShared: Boolean,
    val publicUrl: String?,
    val tags: ArrayList<String>
) : IValidatedEntity, BaseEntity<Long> {
    override fun validate(): Boolean {
        return name.isNotEmpty()
    }
}
