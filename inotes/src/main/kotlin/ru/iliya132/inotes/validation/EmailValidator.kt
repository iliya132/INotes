package ru.iliya132.inotes.validation

import java.util.regex.Matcher
import java.util.regex.Pattern
import javax.validation.ConstraintValidator
import javax.validation.ConstraintValidatorContext

class EmailValidator : ConstraintValidator<ValidEmail, String> {
    private val pattern: Pattern = Pattern.compile(REGEX)
    private var matcher: Matcher? = null

    override fun initialize(constraintAnnotation: ValidEmail?) {
        super.initialize(constraintAnnotation)
    }

    @Override
    override fun isValid(email: String, context: ConstraintValidatorContext?): Boolean {
        return (validateEmail(email))
    }

    private fun validateEmail(email: String): Boolean {
        matcher = pattern.matcher(email)
        return matcher!!.matches()
    }

    companion object {
        const val REGEX: String = "^[_A-Za-z0-9-+](.[_A-Za-z0-9-]+)*@" + "[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,})$"
    }
}