package ru.iliya132.inotes.dto

data class NotebookDTO(
	val id: Long,
	val name: String,
	val color: String,
	val owner: Long
                      ) : IValidatedEntity {
	override fun validate(): Boolean {
		return name.isNotEmpty()
	}
}
