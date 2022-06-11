package ru.iliya132.inotes.dto

import ru.iliya132.inotes.utils.validation.EmailValidator
import ru.iliya132.inotes.utils.validation.PasswordValidator

data class UserDTO(val userName: String, val password: String) : IValidatedEntity {
    override fun validate(): Boolean {
        return EmailValidator.validateEmail(userName) && PasswordValidator.validatePassword(password)
    }
}
