package ru.iliya132.inotes.dto

data class ChangePasswordRequest(
    val currentPassword: String,
    val newPassword: String,
    val newPasswordConfirm: String
)
