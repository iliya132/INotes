package ru.iliya132.inotes.dto

import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull

data class UserLoginDTO(
    @NotNull
    @NotEmpty
    val userName: String,
    @NotNull
    @NotEmpty
    val password: String
)