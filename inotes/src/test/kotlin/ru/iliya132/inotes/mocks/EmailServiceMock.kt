package ru.iliya132.inotes.mocks

import ru.iliya132.inotes.services.EmailService

class EmailServiceMock : EmailService() {

    override fun sendSimpleMessage(to: String, subject: String, text: String) {
        return
    }
}