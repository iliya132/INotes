package ru.iliya132.inotes.services.security

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import ru.iliya132.inotes.repositories.UserRepository
import javax.transaction.Transactional

@Service
@Transactional
class UserDetailsService : org.springframework.security.core.userdetails.UserDetailsService {
    @Autowired
    lateinit var userRepository: UserRepository

    override fun loadUserByUsername(username: String): UserDetails? {
        return userRepository.findByUserName(username) ?: throw UsernameNotFoundException("such user not found")

    }
}