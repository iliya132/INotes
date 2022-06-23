package ru.iliya132.inotes.repositories

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import ru.iliya132.inotes.models.Note

interface NoteRepository : CrudRepository<Note, Long> {

    @Query(value = "select n from Note n where n.notebook in :ids")
    fun findAllByNotebookIds(@Param("ids") notebookIds: Collection<Long>): Collection<Note>

    @Query(value = "select * from notes n where n.public_id = :noteUrl", nativeQuery = true)
    fun findByPublicUrl(@Param("noteUrl") noteUrl: String): Note
}
