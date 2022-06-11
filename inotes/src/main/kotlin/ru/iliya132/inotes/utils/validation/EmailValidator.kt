package ru.iliya132.inotes.utils.validation

import java.util.regex.Pattern

class EmailValidator {
    companion object {
        private const val REGEX: String =
            "^[_A-Za-z\\d-+](.[_A-Za-z\\d-]+)*@[A-Za-z\\d-]+(.[A-Za-z\\d]+)*(.[A-Za-z]{2,})$"

        fun validateEmail(email: String?): Boolean {
            if (email.isNullOrEmpty()) {
                return false
            }
            val pattern: Pattern = Pattern.compile(REGEX)
            val matcher = pattern.matcher(email)
            return matcher.matches()
        }
    }
}