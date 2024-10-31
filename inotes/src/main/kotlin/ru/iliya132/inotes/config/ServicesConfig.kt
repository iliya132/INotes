package ru.iliya132.inotes.config

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.JavaMailSenderImpl
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import ru.iliya132.inotes.repositories.ImageRepository
import ru.iliya132.inotes.repositories.RolesRepository
import ru.iliya132.inotes.repositories.UserRepository
import ru.iliya132.inotes.services.security.UserService

@Configuration
class ServicesConfig {
    @Autowired
    lateinit var userRepository: UserRepository

    @Autowired
    lateinit var rolesRepository: RolesRepository

    @Autowired
    lateinit var imageRepository: ImageRepository

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }

    @Bean
    fun userService(): UserService {
        return UserService(userRepository, rolesRepository, imageRepository, passwordEncoder())
    }

    @Bean
    fun emailSender(): JavaMailSender {
        return JavaMailSenderImpl()
    }
}
