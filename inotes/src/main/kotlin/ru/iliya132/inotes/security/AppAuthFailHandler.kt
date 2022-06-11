package ru.iliya132.inotes.security

import org.springframework.http.HttpStatus
import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse


class AppAuthFailHandler : SimpleUrlAuthenticationFailureHandler() {

	override fun onAuthenticationFailure(
			request: HttpServletRequest?,
			response: HttpServletResponse?,
			exception: AuthenticationException?
	                                    ) {
		response!!.status = HttpStatus.UNAUTHORIZED.value()

		response.outputStream.print("wrong credentials")

	}
}
