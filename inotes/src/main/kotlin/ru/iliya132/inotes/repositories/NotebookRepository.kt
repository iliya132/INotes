package ru.iliya132.inotes.repositories

import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import ru.iliya132.inotes.models.Notebook

interface NotebookRepository : CrudRepository<Notebook, Long> {
    fun findAllByOwner(owner: Long): Collection<Notebook>

    @Query(value = "select exists (select 1 from notebooks n where n.id = :id and n.owner = :owner)",
        nativeQuery = true)
    fun isUserOwner(@Param("id") notebookId: Long, @Param("owner") userId: Long): Boolean

    @Query(value = "select exists (select 1 from notes n " +
            "join notebooks nb on n.notebook = nb.id " +
            "where n.id = :id and nb.owner = :owner)", nativeQuery = true)
    fun isUserOwnerByNoteId(@Param("id") noteId: Long, @Param("owner") userId: Long): Boolean

    @Modifying
    @Query(value = "delete from notebooks n where n.id = :id", nativeQuery = true)
    override fun deleteById(@Param("id") id: Long)
}
