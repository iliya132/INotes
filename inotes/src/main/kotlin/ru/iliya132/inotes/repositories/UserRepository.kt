package ru.iliya132.inotes.repositories

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import ru.iliya132.inotes.models.Note
import ru.iliya132.inotes.models.User

interface UserRepository : CrudRepository<User, Long> {
    @Query(value = "select u from User u where u.userName = :username")
    fun findByUserName (@Param("username") username: String) :User?

    @Query(value = "select exists (select 1 from User u where u.userName = :username)", nativeQuery = true)
    fun existsByUserName(@Param("username") username: String): Boolean
}
