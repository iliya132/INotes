package ru.iliya132.inotes.utils

import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import ru.iliya132.inotes.models.User

@Component
class AuthUtils {
    open fun getCurrentUserId() :Long{
        return (SecurityContextHolder.getContext().authentication.principal as User).id
    }
}