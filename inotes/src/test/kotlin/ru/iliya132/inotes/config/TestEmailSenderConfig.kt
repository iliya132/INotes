package ru.iliya132.inotes.config

import org.mockito.Mockito
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.mail.javamail.JavaMailSender

@Configuration
@Profile("test")
class TestEmailSenderConfig {
    @Bean
    fun emailSender(): JavaMailSender {
        return Mockito.mock(JavaMailSender::class.java)
    }
}
