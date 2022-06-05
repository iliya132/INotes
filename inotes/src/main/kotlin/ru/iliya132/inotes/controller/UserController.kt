package ru.iliya132.inotes.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.security.Principal

@RestController
@RequestMapping("/api/user")
class UserController {
    @GetMapping
    fun retrievePrincipal(principal: Principal?): Principal? {
        return principal
    }
}