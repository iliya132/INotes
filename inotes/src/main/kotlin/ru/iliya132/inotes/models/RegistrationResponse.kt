package ru.iliya132.inotes.models

data class RegistrationResponse(
    val succeeded: Boolean,
    val error: String?
) : java.io.Serializable
