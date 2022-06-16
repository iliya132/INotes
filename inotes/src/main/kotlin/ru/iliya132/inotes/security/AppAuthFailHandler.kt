package ru.iliya132.inotes.security

import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse


class AppAuthFailHandler : SimpleUrlAuthenticationFailureHandler() {
    private val log = LoggerFactory.getLogger(AppAuthFailHandler::class.java)
    override fun onAuthenticationFailure(
        request: HttpServletRequest?,
        response: HttpServletResponse?,
        exception: AuthenticationException?
    ) {
        if (exception!=null) {
            log.error(exception.message)
        }
        response!!.status = HttpStatus.UNAUTHORIZED.value()

        response.outputStream.print("wrong credentials")

    }
}
