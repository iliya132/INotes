package ru.iliya132.inotes.security

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import ru.iliya132.inotes.services.security.UserService

@Component
class AppAuthProvider : AuthenticationProvider {
    @Autowired
    lateinit var userService: UserService

    @Autowired
    lateinit var passwordEncoder: PasswordEncoder

    override fun authenticate(authentication: Authentication): Authentication {
        val password = authentication.credentials as String

        val user = try {
            userService.getUserFull(authentication)
        } catch (e: NotFoundException) {
            throw BadCredentialsException("Username not found")
        }

        if (!passwordEncoder.matches(password, user.password)) {
            throw BadCredentialsException("Wrong password")
        }

        val authorities = user.authorities
        return UsernamePasswordAuthenticationToken(user, password, authorities)
    }

    override fun supports(authentication: Class<*>?): Boolean {
        return true
    }
}