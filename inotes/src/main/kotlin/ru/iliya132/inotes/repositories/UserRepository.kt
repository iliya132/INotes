package ru.iliya132.inotes.repositories

import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional
import ru.iliya132.inotes.models.User

interface UserRepository : CrudRepository<User, Long> {
    @Query("select * from users where username = :username limit 1", nativeQuery = true)
    fun findByUserName(@Param("username") username: String): User?

    @Query("select * from users where external_user_name = :username limit 1", nativeQuery = true)
    fun findByExternalUserName(@Param("username") username: String): User?

    @Query("select * from users where external_login = :login limit 1", nativeQuery = true)
    fun findByExternalLogin(@Param("login") login: String): User?

    @Query("select exists (select 1 from users u where u.username = :username);", nativeQuery = true)
    fun existsByUserName(@Param("username") username: String): Boolean

    @Query("select exists (select 1 from users u where u.external_user_name = :username);", nativeQuery = true)
    fun existsByExternalUserName(@Param("username") username: String): Boolean

    @Query("select exists (select 1 from users u where u.external_login = :login);", nativeQuery = true)
    fun existsByExternalLogin(@Param("login") login: String): Boolean

    @Query("select id from users where username = :username limit 1", nativeQuery = true)
    fun findFirstIdByUserName(@Param("username") username: String): Long?

    @Query("select id from users where external_user_name = :username limit 1", nativeQuery = true)
    fun findFirstIdByExternalUserName(@Param("username") username: String): Long?

    @Modifying
    @Transactional
    @Query("update users set password = :password where id = :userId", nativeQuery = true)
    fun changePassword(@Param("password") newPassword: String, @Param("userId") userId: Long)
}
