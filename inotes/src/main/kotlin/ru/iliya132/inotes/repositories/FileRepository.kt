package ru.iliya132.inotes.repositories

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import ru.iliya132.inotes.models.Blob

interface FileRepository : JpaRepository<Blob, Long> {
    fun existsByNoteIdAndFileName(noteId: Long, fileName: String): Boolean
    fun findByNoteIdAndFileName(noteId: Long, fileName: String): Blob

    @Query("select SUM(size) from blob where user_id = :userId", nativeQuery = true)
    fun sumSizeByUserId(userId: Long): Long?
}
