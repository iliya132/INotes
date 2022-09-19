package ru.iliya132.inotes.config

import org.mockito.Mockito.mock
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Profile
import ru.iliya132.inotes.mocks.*
import ru.iliya132.inotes.repositories.*

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

    @Bean
    fun notebookRepository(): NotebookRepository {
        return NotebookRepositoryMock()
    }

    @Bean
    fun noteRepository(): NoteRepository {
        return NoteRepositoryMock()
    }

    @Bean
    fun tagRepository(): TagRepository {
        return TagRepositoryMock()
    }

}
