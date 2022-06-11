package ru.iliya132.inotes.dto

data class NoteDTO(
		val id: Long,
		val name: String,
		val content: String,
		val notebookId: Long
                  ) : IValidatedEntity {
	override fun validate(): Boolean {
		return name.isNotEmpty() &&
				content.isNotEmpty() &&
				notebookId > 0
	}
}
