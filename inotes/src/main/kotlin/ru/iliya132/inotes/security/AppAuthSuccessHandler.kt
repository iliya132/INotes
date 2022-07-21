package ru.iliya132.inotes.security

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.Authentication
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler
import ru.iliya132.inotes.services.security.UserService
import java.io.IOException
import javax.servlet.ServletException
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class AppAuthSuccessHandler : SimpleUrlAuthenticationSuccessHandler() {
    private val log = LoggerFactory.getLogger(AppAuthSuccessHandler::class.java)

    @Autowired
    private lateinit var userService: UserService

    @Throws(IOException::class, ServletException::class)
    override fun handle(
        request: HttpServletRequest, response: HttpServletResponse,
        authentication: Authentication
    ) {
        log.info("User login: ${authentication.name}")
        if (shouldRedirect(request)) {
            val redirectUrl = response.encodeRedirectURL("http://localhost:3000/")
            response.sendRedirect(redirectUrl)
        }
    }

    private fun shouldRedirect(request: HttpServletRequest): Boolean {
        return request.requestURL.contains("oauth", true)
    }
}
