package ru.iliya132.inotes.dto

import ru.iliya132.inotes.models.base.BaseEntity

data class NotebookDTO(
    override val id: Long,
    val name: String,
    val color: String,
    val owner: Long
) : IValidatedEntity, BaseEntity<Long> {
    override fun validate(): Boolean {
        return name.isNotEmpty()
    }
}
