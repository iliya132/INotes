package ru.iliya132.inotes.dto

import ru.iliya132.inotes.validation.EmailValidator


data class SimpleUserDTO(
		val userName: String = "",
		val roles: Collection<String> = listOf()
                        ) : IValidatedEntity {
	override fun validate(): Boolean {
		return EmailValidator.validateEmail(userName) && roles.isNotEmpty()
	}
}
