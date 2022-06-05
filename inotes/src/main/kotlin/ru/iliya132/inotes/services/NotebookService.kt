package ru.iliya132.inotes.services

import org.springframework.stereotype.Service
import ru.iliya132.inotes.dto.NotebookDTO
import ru.iliya132.inotes.dto.NotebookWithNotesDTO
import ru.iliya132.inotes.models.Notebook
import ru.iliya132.inotes.repositories.NoteRepository
import ru.iliya132.inotes.repositories.NotebookRepository

@Service
class NotebookService(
    private val notebookRepository: NotebookRepository,
    private val noteRepository: NoteRepository
) {
    fun getNotebooksForUser(): List<NotebookWithNotesDTO> {

//        val notebooks = notebookRepository.findAllByOwner(user.id)
//        val notes = noteRepository.findAllByNotebookIds(notebooks.map { it.id }).groupBy { it.notebook }
//        return notebooks.map {
//            NotebookWithNotesDTO(
//                it.id,
//                it.name,
//                it.color,
//                notes[it.id]?.map { note -> NoteDTO(note.id, note.name, note.content) } ?: listOf())
//        }
        return listOf()
    }

    fun save(notebook: NotebookDTO){
        notebookRepository.save(Notebook(0L, notebook.name, notebook.owner, notebook.color))
    }

    fun isUserOwner(notebookId: Long, userId: Long) :Boolean{
        return notebookRepository.isUserOwner(notebookId, userId)
    }

    fun remove(notebookId: Long){
        notebookRepository.deleteById(notebookId)
    }
}