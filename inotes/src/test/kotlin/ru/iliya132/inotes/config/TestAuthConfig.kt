package ru.iliya132.inotes.config

import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Import
import org.springframework.context.annotation.Profile
import org.springframework.security.crypto.password.PasswordEncoder
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
	fun userService(
		userRepository: UserRepository,
		rolesRepository: RolesRepository,
		passwordEncoder: PasswordEncoder
	               ): UserService {
		return UserService(userRepository, rolesRepository, passwordEncoder)
	}
}
