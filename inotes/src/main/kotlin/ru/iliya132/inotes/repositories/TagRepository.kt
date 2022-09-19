package ru.iliya132.inotes.repositories

import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import ru.iliya132.inotes.models.Tag
import ru.iliya132.inotes.models.TagKey
import javax.transaction.Transactional

interface TagRepository : CrudRepository<Tag, TagKey>{
    @Modifying
    @Transactional
    @Query("delete from note_tags where note_id = :noteId", nativeQuery = true)
    fun deleteAllByNoteId(@Param("noteId") noteId: Long)

    @Query("select tag from note_tags where note_id = :noteId", nativeQuery = true)
    fun getByNoteId(@Param("noteId") noteId: Long) :List<String>

    @Query("select tag\n" +
            "from public.note_tags nt \n" +
            "join public.notes n on n.id = nt.note_id \n" +
            "join public.notebooks nb on nb.id = n.notebook \n" +
            "where nb.\"owner\" = :userId", nativeQuery = true)
    fun getByUserId(@Param("userId") userId: Long): List<String>
}
