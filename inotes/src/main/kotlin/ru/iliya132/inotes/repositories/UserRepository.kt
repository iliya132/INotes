package ru.iliya132.inotes.repositories

import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import ru.iliya132.inotes.models.User

interface UserRepository : CrudRepository<User, Long> {
    fun findByUserName (@Param("username") username: String) :User?

    fun existsByUserName(@Param("username") username: String): Boolean
}
