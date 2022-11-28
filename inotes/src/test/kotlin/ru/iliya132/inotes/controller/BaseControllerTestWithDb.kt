package ru.iliya132.inotes.controller

import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.context.annotation.Import
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.TestPropertySource
import ru.iliya132.inotes.config.SecurityConfig
import ru.iliya132.inotes.config.ServicesConfig
import ru.iliya132.inotes.config.TestEmailSenderConfig
import ru.iliya132.inotes.config.TestEmbeddedPostgresqlConfig
import ru.iliya132.inotes.services.EmailService
import ru.iliya132.inotes.services.NotebookService
import ru.iliya132.inotes.services.security.OAuthUserService
import ru.iliya132.inotes.services.security.OIdcUserService
import ru.iliya132.inotes.services.security.UserDetailsService

@ActiveProfiles("test")
@Import(
    TestEmbeddedPostgresqlConfig::class,
    UserDetailsService::class,
    NotebookService::class,
    TestEmailSenderConfig::class,
    EmailService::class,
    ServicesConfig::class,
    SecurityConfig::class,
    OAuthUserService::class,
    OIdcUserService::class
)
@TestPropertySource("classpath:application.properties")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
abstract class BaseControllerTestWithDb {

    companion object {
        const val FILE_API_URL = "/api/file"
        const val defaultUserName = "defaultUser@test.ru"
        const val secondUserName = "second_defaultUser@test.ru"
        const val defaultUserPassword = "defaultPassword123!"
    }
}
