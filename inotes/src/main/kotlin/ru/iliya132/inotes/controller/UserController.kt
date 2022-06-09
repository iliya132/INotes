package ru.iliya132.inotes.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.iliya132.inotes.dto.SimpleUserDTO
import ru.iliya132.inotes.dto.UserDTO
import ru.iliya132.inotes.models.RegistrationResponse
import ru.iliya132.inotes.services.security.UserService
import java.security.Principal
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@RestController
@RequestMapping("/auth")
class UserController {
    @Autowired
    private lateinit var userService: UserService

    @GetMapping("/user")
    fun retrievePrincipal(principal: Principal): SimpleUserDTO {
        return userService.getUser(principal)
    }

    @PostMapping("/register")
    fun register(user: UserDTO, request: HttpServletRequest, response: HttpServletResponse): RegistrationResponse {
        val result = userService.register(user)
        if (result.succeeded) {
            request.login(user.userName, user.password)
        } else {
            response.sendError(400, result.error!!)
        }
        return result
    }
}
