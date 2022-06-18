package ru.iliya132.inotes.repositories

import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import ru.iliya132.inotes.models.User

interface UserRepository : CrudRepository<User, Long> {
    fun findByUserName(@Param("username") username: String): User?

    fun existsByUserName(@Param("username") username: String): Boolean

    @Query("select id from users where username = :username limit 1", nativeQuery = true)
    fun findFirstIdByUserName(@Param("username") username: String): Long?

    @Modifying
    @Query("update users set password = :password where id = :userId", nativeQuery = true)
    fun changePassword(@Param("password") newPassword: String, @Param("userId") userId: Long)
}
