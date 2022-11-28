package ru.iliya132.inotes.security

import org.slf4j.LoggerFactory
import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.AuthenticationEntryPoint
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class AuthEntryPoint : AuthenticationEntryPoint {
    private val log = LoggerFactory.getLogger(AuthEntryPoint::class.java)
    override fun commence(
        request: HttpServletRequest,
        response: HttpServletResponse,
        authException: AuthenticationException?
    ) {
        if (authException!=null) {
            log.error("${authException.message}, uri:${request.requestURI}, url:${request.requestURL}, " +
                    "context-path:${request.contextPath}, ${request.queryString}")

            response.status = HttpServletResponse.SC_FORBIDDEN
            response.writer.println("Unauthorized")
        }
    }
}
