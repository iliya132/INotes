package ru.iliya132.inotes.services

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import ru.iliya132.inotes.dto.NoteDTO
import ru.iliya132.inotes.dto.NotebookDTO
import ru.iliya132.inotes.dto.NotebookWithNotesDTO
import ru.iliya132.inotes.models.Note
import ru.iliya132.inotes.models.Notebook
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
        notes.values.forEach { ensureNotesHasPublicIdWithNote(it) }
        return notebooks.map {
            NotebookWithNotesDTO(
                it.id,
                it.name,
                it.color,
                notes[it.id]?.map { note -> note.toDto() } ?: listOf())
        }
    }

    fun getNotes(notebookId: Long): List<NoteDTO> {
        val notes = noteRepository.findAllByNotebookIds(listOf(notebookId)).map { it.toDto() }
        ensureNotesHasPublicId(notes)
        return notes
    }

    private fun ensureNotesHasPublicId(notes: List<NoteDTO>) {
        if (!notes.all { it.publicUrl!=null && it.publicUrl.isNotEmpty() }) {
            val updatedNotes = notes.filter { it.publicUrl==null || it.publicUrl.isEmpty() }
                .map {
                    it.copy(publicUrl = UUID.randomUUID().toString())
                        .fromDTO()
                }
            noteRepository.saveAll(updatedNotes)
        }
    }

    private fun ensureNotesHasPublicIdWithNote(notes: List<Note>) {
        if (!notes.all { it.publicId!=null && it.publicId!!.isNotEmpty() }) {
            val updatedNotes = notes.filter { it.publicId==null || it.publicId!!.isEmpty() }
                .map {
                    it.copy(publicId = UUID.randomUUID().toString())
                }
            noteRepository.saveAll(updatedNotes)
        }
    }

    fun save(notebook: NotebookDTO): Notebook {
        return notebookRepository.save(notebook.fromDTO())
    }

    @Transactional
    fun addNote(note: NoteDTO): Note {
        val newNote = noteRepository.save(note.fromDTO())
        newNote.publicId = UUID.randomUUID().toString()
        return noteRepository.save(newNote)
    }

    fun saveNote(note: NoteDTO): Note {
        return noteRepository.save(note.fromDTO())
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

    fun sharePublicUrl(noteId: Long, isEnabled: Boolean): String? {
        val note = noteRepository.findById(noteId).orElseThrow()
        note.isPublicUrlShared = isEnabled
        if (isEnabled) {
            note.publicId = UUID.randomUUID().toString()
        }
        noteRepository.save(note)
        return note.publicId
    }

    fun getShared(noteUrl: String): Note {
        return noteRepository.findByPublicUrl(noteUrl);
    }
}


