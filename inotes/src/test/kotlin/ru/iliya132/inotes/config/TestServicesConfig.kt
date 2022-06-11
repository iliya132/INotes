package ru.iliya132.inotes.config

import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import ru.iliya132.inotes.repositories.NoteRepository
import ru.iliya132.inotes.repositories.NotebookRepository
import ru.iliya132.inotes.services.NotebookService

@TestConfiguration
class TestServicesConfig {

    @Bean
    fun notebookService(notebookRepository: NotebookRepository,
                        noteRepository: NoteRepository): NotebookService {
        return NotebookService(notebookRepository, noteRepository)
    }
}
