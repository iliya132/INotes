package ru.iliya132.inotes.security

import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.AuthenticationEntryPoint
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class AuthEntryPoint : AuthenticationEntryPoint {
    override fun commence(
        request: HttpServletRequest,
        response: HttpServletResponse,
        authException: AuthenticationException?
    ) {
        if (authException != null) {
            response.status = HttpServletResponse.SC_FORBIDDEN;
            response.writer.println("Unauthorized");
        }
    }
}
