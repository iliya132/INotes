package ru.iliya132.inotes.config

import org.mockito.Mockito
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Import
import org.springframework.context.annotation.Profile
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import ru.iliya132.inotes.models.Role
import ru.iliya132.inotes.models.User
import ru.iliya132.inotes.repositories.ImageRepository
import ru.iliya132.inotes.repositories.RolesRepository
import ru.iliya132.inotes.repositories.UserRepository
import ru.iliya132.inotes.services.security.UserDetailsService
import ru.iliya132.inotes.services.security.UserService

@TestConfiguration
@Profile("test")
@Import(TestDbConfig::class)
class TestAuthConfig {

    @Bean
    fun userDetailsService(userRepository: UserRepository): UserDetailsService {
        return UserDetailsService(userRepository)
    }

    @Bean
    fun imageRepository(): ImageRepository {
        return Mockito.mock(ImageRepository::class.java)
    }

    @Bean
    fun userService(
        userRepository: UserRepository,
        rolesRepository: RolesRepository,
        imageRepository: ImageRepository,
        passwordEncoder: PasswordEncoder
    ): UserService {
        val defaultUser = User(0, "defaultUser@test.ru", BCryptPasswordEncoder().encode("defaultPassword123!"),
            true, listOf(Role(0, "ROLE_USER")))
        userRepository.save(defaultUser)
        return UserService(userRepository, rolesRepository, imageRepository, passwordEncoder)
    }
}
