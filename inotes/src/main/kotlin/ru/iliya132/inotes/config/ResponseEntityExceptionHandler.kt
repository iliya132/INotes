package ru.iliya132.inotes.config

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler
import ru.iliya132.inotes.utils.validation.CustomValidationException

@ControllerAdvice
class ResponseEntityExceptionHandler : ResponseEntityExceptionHandler() {
    @ExceptionHandler(CustomValidationException::class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    fun handleConstraintViolationException(e: CustomValidationException): ResponseEntity<String?>? {
        return ResponseEntity(e.message, HttpStatus.BAD_REQUEST)
    }
}
