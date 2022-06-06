package ru.iliya132.inotes.repositories

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import ru.iliya132.inotes.models.Role

interface RolesRepository : CrudRepository<Role, Long> {

    @Query(value = "select r from Role r where r.name = :name")
    fun findByName(@Param("name")roleName: String): Collection<Role>

}
