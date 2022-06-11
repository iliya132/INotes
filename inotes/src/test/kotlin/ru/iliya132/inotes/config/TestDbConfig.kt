package ru.iliya132.inotes.config

import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Profile
import ru.iliya132.inotes.mocks.RolesRepositoryMock
import ru.iliya132.inotes.mocks.UserRepositoryMock
import ru.iliya132.inotes.repositories.RolesRepository
import ru.iliya132.inotes.repositories.UserRepository

@TestConfiguration
@Profile("test")
class TestDbConfig {
	@Bean
	fun userRepository(): UserRepository {
		return UserRepositoryMock()
	}

	@Bean
	fun rolesRepository(): RolesRepository {
		return RolesRepositoryMock()
	}
}
