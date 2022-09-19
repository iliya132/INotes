package ru.iliya132.inotes.config

import org.mockito.Mockito
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.mail.javamail.JavaMailSender
import ru.iliya132.inotes.repositories.NoteRepository
import ru.iliya132.inotes.repositories.NotebookRepository
import ru.iliya132.inotes.repositories.TagRepository
import ru.iliya132.inotes.services.EmailService
import ru.iliya132.inotes.services.NotebookService

@TestConfiguration
class TestServicesConfig {

    @Bean
    fun notebookService(notebookRepository: NotebookRepository,
                        noteRepository: NoteRepository,
                        tagsRepository: TagRepository): NotebookService {
        return NotebookService(notebookRepository, noteRepository, tagsRepository)
    }

    @Bean
    fun emailSender(): JavaMailSender {
        return Mockito.mock(JavaMailSender::class.java)
    }

    @Bean
    fun emailService(): EmailService {
        return Mockito.mock(EmailService::class.java)
    }
}
