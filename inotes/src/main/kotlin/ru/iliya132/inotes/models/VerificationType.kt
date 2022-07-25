package ru.iliya132.inotes.models

enum class VerificationType(private val code: String) {
    VERIFY_EMAIL("VERIFY_EMAIL"), RESTORE_PASSWORD("RESTORE_PASSWORD");

    fun getCode(): String {
        return code
    }
}
