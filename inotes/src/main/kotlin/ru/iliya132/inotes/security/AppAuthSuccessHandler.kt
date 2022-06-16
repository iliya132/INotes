package ru.iliya132.inotes.security

import org.slf4j.LoggerFactory
import org.springframework.security.core.Authentication
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler
import java.io.IOException
import javax.servlet.ServletException
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class AppAuthSuccessHandler : SimpleUrlAuthenticationSuccessHandler() {
    private val log = LoggerFactory.getLogger(AppAuthSuccessHandler::class.java)

    @Throws(IOException::class, ServletException::class)
    override fun handle(
        request: HttpServletRequest?, response: HttpServletResponse?,
        authentication: Authentication?
    ) {
        log.info("User login: ${authentication?.name}")
    }
}
