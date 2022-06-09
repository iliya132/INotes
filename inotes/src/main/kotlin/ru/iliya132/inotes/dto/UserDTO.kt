package ru.iliya132.inotes.dto

import ru.iliya132.inotes.validation.ValidEmail
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

data class UserDTO(
    @NotNull
    @ValidEmail
    @NotEmpty
    val userName: String,
    @NotNull
    @NotEmpty
    val password: String
)
