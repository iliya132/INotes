package ru.iliya132.inotes.dto

import ru.iliya132.inotes.validation.EmailValidator
import ru.iliya132.inotes.validation.PasswordValidator

data class UserLoginDTO(val userName: String,
                        val password: String) : IValidatedEntity {
	override fun validate(): Boolean {
		return EmailValidator.validateEmail(userName) && PasswordValidator.validatePassword(password)
	}
}
