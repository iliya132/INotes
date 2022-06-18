package ru.iliya132.inotes.repositories

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import ru.iliya132.inotes.models.Avatar
import java.util.*

interface ImageRepository : JpaRepository<Avatar, Long> {
    fun findByUserId(userId: Long): Optional<Avatar>

    @Query("select id from avatars where user_id = :user_id limit 1", nativeQuery = true)
    fun findFirstIdByUserId(@Param("user_id") userId: Long): Optional<Long>
    fun existsByUserId(userId: Long): Boolean

    @Modifying
    @Query("delete from Avatar where user_id = :user_id")
    fun deleteByUserId(@Param("user_id") userId: Long)
}
