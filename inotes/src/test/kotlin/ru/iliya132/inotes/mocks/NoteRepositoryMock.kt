package ru.iliya132.inotes.mocks

import ru.iliya132.inotes.models.Note
import ru.iliya132.inotes.repositories.NoteRepository
import java.util.*

class NoteRepositoryMock : GenericCrudMock<Note, Long>(), NoteRepository {
    override fun findById(id: Long): Optional<Note> {
        return super.findById(id)
    }

    override fun existsById(id: Long): Boolean {
        return super.existsById(id)
    }

    override fun deleteById(id: Long) {
        return super.deleteById(id)
    }

    override fun findAllByNotebookIds(notebookIds: Collection<Long>): Collection<Note> {
        val allById = super.findAll().groupBy { it.notebook }
        return notebookIds.filter { allById.containsKey(it) }.flatMap { allById[it]!! }
    }

    override fun findByPublicUrl(noteUrl: String): Note {
        return super.findAll().filter { it.publicId==noteUrl }.first()

    }
}
