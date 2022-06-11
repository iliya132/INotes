package ru.iliya132.inotes.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import ru.iliya132.inotes.dto.SimpleUserDTO
import ru.iliya132.inotes.dto.UserDTO
import ru.iliya132.inotes.models.RegistrationResponse
import ru.iliya132.inotes.services.security.UserService
import ru.iliya132.inotes.utils.validation.CustomValidationException
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
    fun register(@RequestBody user: UserDTO,
                 request: HttpServletRequest,
                 response: HttpServletResponse
    ): RegistrationResponse {
        if (!user.validate()) {
            throw CustomValidationException(INVALID_USER_ATTRIBUTES)
        }

        val result = userService.register(user)
        if (!result.succeeded) {
            response.sendError(400, result.error!!)
        }
        return result
    }


    companion object {
        const val INVALID_USER_ATTRIBUTES = "Provided user is not valid"
    }
}
