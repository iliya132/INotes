package ru.iliya132.inotes.mocks

import ru.iliya132.inotes.models.Notebook
import ru.iliya132.inotes.repositories.NotebookRepository
import java.util.*

class NotebookRepositoryMock : GenericCrudMock<Notebook, Long>(), NotebookRepository {
    override fun existsById(id: Long): Boolean {
        return super.existsById(id)
    }

    override fun deleteById(id: Long) {
        super.deleteById(id)
    }

    override fun findAllByOwner(owner: Long): Collection<Notebook> {
        return super.findAll().filter { it.owner==owner }
    }

    override fun isUserOwner(notebookId: Long, userId: Long): Boolean {
        val notebook = super.findById(notebookId).orElseThrow()
        return notebook.owner==userId
    }

    override fun findById(id: Long): Optional<Notebook> {
        return super.findById(id)
    }
}
