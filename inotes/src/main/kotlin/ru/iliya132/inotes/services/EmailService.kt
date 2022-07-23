package ru.iliya132.inotes.services

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service

@Service
open class EmailService {
    @Autowired
    lateinit var emailSender: JavaMailSender

    open fun sendSimpleMessage(to: String, subject: String, text: String) {
        val message = SimpleMailMessage()
        message.setFrom("noreply@i-note.online")
        message.setTo(to)
        message.setSubject(subject)
        message.setText(text)
        emailSender.send(message)
    }
}