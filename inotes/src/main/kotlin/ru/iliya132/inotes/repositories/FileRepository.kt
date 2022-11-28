package ru.iliya132.inotes.repositories

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import ru.iliya132.inotes.models.Blob
import ru.iliya132.inotes.models.BlobLite

interface FileRepository : JpaRepository<Blob, Long> {
    fun existsByNoteIdAndFileName(noteId: Long, fileName: String): Boolean
    fun findByNoteIdAndFileName(noteId: Long, fileName: String): Blob

    @Query("select id, file_name as fileName, size from blob where note_id = :note_id", nativeQuery = true)
    fun findByNoteId(@Param("note_id")noteId: Long): Collection<BlobLite>

    @Query("select user_id from blob where id = :id", nativeQuery = true)
    fun getUserIdById(id: Long): Long
    @Query("select SUM(size) from blob where user_id = :userId", nativeQuery = true)
    fun sumSizeByUserId(userId: Long): Long?
}
