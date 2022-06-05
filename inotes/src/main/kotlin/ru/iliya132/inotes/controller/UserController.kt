package ru.iliya132.inotes.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.iliya132.inotes.dto.UserDTO
import ru.iliya132.inotes.models.RegistrationResponse
import ru.iliya132.inotes.services.security.UserService
import java.security.Principal
import javax.servlet.http.HttpServletRequest

@RestController
@RequestMapping("/api/user")
class UserController {
    @Autowired
    lateinit var userService: UserService

    @GetMapping
    fun retrievePrincipal(principal: Principal?): Principal? {
        return principal
    }

    @PostMapping("/register")
    fun register(user: UserDTO, request: HttpServletRequest): RegistrationResponse{
        val result = userService.register(user)
        if(result.succeeded){
            request.login(user.userName, user.password)
        }
        return result
    }
}