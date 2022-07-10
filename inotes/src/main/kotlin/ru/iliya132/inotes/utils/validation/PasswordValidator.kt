package ru.iliya132.inotes.utils.validation

import java.util.regex.Pattern

class PasswordValidator {
    companion object {
        private const val REGEX: String = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*).{8,}\$"

        fun validatePassword(password: String?): Boolean {
            if (password.isNullOrEmpty()) {
                return false
            }
            val pattern: Pattern = Pattern.compile(REGEX)
            val matcher = pattern.matcher(password)
            return matcher.matches()
        }
    }
}
