package ru.iliya132.inotes.dto

import ru.iliya132.inotes.utils.validation.EmailValidator


data class SimpleUserDTO(
    val userName: String = "",
    val roles: Collection<String> = listOf(),
    val avatarUrl: String?
) : IValidatedEntity {
    override fun validate(): Boolean {
        return EmailValidator.validateEmail(userName) && roles.isNotEmpty()
    }

    override fun equals(other: Any?): Boolean {
        if (this===other) return true
        if (javaClass!=other?.javaClass) return false

        other as SimpleUserDTO

        if (userName!=other.userName) return false
        if (roles!=other.roles) return false

        return true
    }

    override fun hashCode(): Int {
        var result = userName.hashCode()
        result = 31 * result + roles.hashCode()
        return result
    }
}
