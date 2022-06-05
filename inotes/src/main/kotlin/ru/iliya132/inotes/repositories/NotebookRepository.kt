package ru.iliya132.inotes.repositories

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import ru.iliya132.inotes.models.Notebook

interface NotebookRepository : CrudRepository<Notebook, Long> {
    fun findAllByOwner(owner: Long) : Collection<Notebook>

    @Query(value = "select exists (select 1 from Notebook n where n.id = :id and n.owner = :owner)", nativeQuery = true)
    fun isUserOwner(@Param("id") notebookId: Long, @Param("owner") userId: Long) :Boolean
}
