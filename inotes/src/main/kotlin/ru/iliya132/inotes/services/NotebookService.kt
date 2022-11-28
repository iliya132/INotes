package ru.iliya132.inotes.services

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import ru.iliya132.inotes.dto.NoteDTO
import ru.iliya132.inotes.dto.NotebookDTO
import ru.iliya132.inotes.dto.NotebookWithNotesDTO
import ru.iliya132.inotes.models.Note
import ru.iliya132.inotes.models.Notebook
import ru.iliya132.inotes.models.Tag
import ru.iliya132.inotes.repositories.NoteRepository
import ru.iliya132.inotes.repositories.NotebookRepository
import ru.iliya132.inotes.repositories.TagRepository
import ru.iliya132.inotes.utils.fromDTO
import ru.iliya132.inotes.utils.toDto
import java.util.*
import kotlin.collections.ArrayList

@Service
class NotebookService(
    private val notebookRepository: NotebookRepository,
    private val noteRepository: NoteRepository,
    private val tagsRepository: TagRepository
) {
    fun getNotebooksForUser(id: Long): List<NotebookWithNotesDTO> {
        val notebooks = notebookRepository.findAllByOwner(id)
        val notes = noteRepository.findAllByNotebookIds(notebooks.map { it.id })
            .map {
                val noteDto = it.toDto()
                val tags = tagsRepository.getByNoteId(it.id)
                noteDto.tags.addAll(tags)
                noteDto
            }.groupBy { it.notebookId }
        return notebooks.map {
            NotebookWithNotesDTO(
                it.id,
                it.name,
                it.color,
                notes[it.id] ?: listOf())
        }
    }

    fun getNotes(notebookId: Long): List<NoteDTO> {
        val notes = noteRepository.findAllByNotebookIds(listOf(notebookId)).map { it.toDto() }
            .map {
                val tags = tagsRepository.getByNoteId(it.id)
                it.tags.addAll(tags)
                return@map it
            }
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

    fun isNoteUserOwned(noteId: Long, userId: Long): Boolean {
        return notebookRepository.isUserOwnerByNoteId(noteId, userId)
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
        noteRepository.save(note)
        return note.publicId
    }

    fun getShared(noteUrl: String): Note? {
        return try {
            noteRepository.findByPublicUrl(noteUrl)
        } catch (e: Exception) {
            return null
        }
    }

    fun updateTags(noteId: Long, tags: ArrayList<String>) {
        tagsRepository.deleteAllByNoteId(noteId)
        tagsRepository.saveAll(tags.map { Tag(noteId, it) })
    }

    fun getUserTags(id: Long): List<String>{
        return tagsRepository.getByUserId(id)
    }
}


