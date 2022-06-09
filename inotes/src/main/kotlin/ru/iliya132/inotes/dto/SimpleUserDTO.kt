package ru.iliya132.inotes.dto

data class SimpleUserDTO(
    val userName: String = "",
    val roles: Collection<String> = listOf()
)
