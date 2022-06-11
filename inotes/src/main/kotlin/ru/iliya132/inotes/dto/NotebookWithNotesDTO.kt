package ru.iliya132.inotes.dto

data class NotebookWithNotesDTO(
		val id: Long,
		val name: String,
		val color: String,
		val notes: Collection<NoteDTO>
                               ) : IValidatedEntity {
	override fun validate(): Boolean {
		return name.isNotEmpty()
	}
}
