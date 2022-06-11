package ru.iliya132.inotes.services

import org.springframework.stereotype.Service
import ru.iliya132.inotes.dto.NoteDTO
import ru.iliya132.inotes.dto.NotebookDTO
import ru.iliya132.inotes.dto.NotebookWithNotesDTO
import ru.iliya132.inotes.models.Note
import ru.iliya132.inotes.repositories.NoteRepository
import ru.iliya132.inotes.repositories.NotebookRepository
import ru.iliya132.inotes.utils.fromDTO
import ru.iliya132.inotes.utils.toDto
import java.util.*

@Service
class NotebookService(
		private val notebookRepository: NotebookRepository,
		private val noteRepository: NoteRepository
                     ) {
	fun getNotebooksForUser(id: Long): List<NotebookWithNotesDTO> {

		val notebooks = notebookRepository.findAllByOwner(id)
		val notes = noteRepository.findAllByNotebookIds(notebooks.map { it.id }).groupBy { it.notebook }
		return notebooks.map {
			NotebookWithNotesDTO(
				it.id,
				it.name,
				it.color,
				notes[it.id]?.map { note -> note.toDto() } ?: listOf())
		}
	}

	fun getNotes(notebookId: Long): List<NoteDTO> {
		return noteRepository.findAllByNotebookIds(listOf(notebookId)).map { it.toDto() }
	}

	fun save(notebook: NotebookDTO) {
		notebookRepository.save(notebook.fromDTO())
	}

	fun saveNote(note: NoteDTO) {
		noteRepository.save(note.fromDTO())
	}

	fun findNoteById(id: Long): Optional<Note> {
		return noteRepository.findById(id)
	}

	fun isUserOwner(notebookId: Long, userId: Long): Boolean {
		return notebookRepository.isUserOwner(notebookId, userId)
	}

	fun remove(notebookId: Long) {
		notebookRepository.deleteById(notebookId)
	}

	fun removeNote(noteId: Long) {
		noteRepository.deleteById(noteId)
	}
}


