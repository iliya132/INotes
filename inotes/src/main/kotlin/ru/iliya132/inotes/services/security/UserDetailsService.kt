package ru.iliya132.inotes.services.security

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import ru.iliya132.inotes.models.Role
import ru.iliya132.inotes.repositories.RolesRepository
import ru.iliya132.inotes.repositories.UserRepository
import javax.transaction.Transactional


@Service
@Transactional
class UserDetailsService : org.springframework.security.core.userdetails.UserDetailsService {
    @Autowired
    lateinit var userRepository: UserRepository

    override fun loadUserByUsername(username: String): UserDetails? {
        val user = userRepository.findByUserName(username) ?: throw UsernameNotFoundException("such user not found")
        return org.springframework.security.core.userdetails.User(
            user.userName,
            user.password,
            user.enabled,
            true,
            true,
            true,
            getAuthorities(user.roles)
        )
    }

    private fun getAuthorities(
        roles: Collection<Role>
    ): Collection<GrantedAuthority> {
        return roles.map { SimpleGrantedAuthority(it.name) }
    }
}