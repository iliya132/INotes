package ru.iliya132.inotes.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import ru.iliya132.inotes.dto.ChangePasswordRequest
import ru.iliya132.inotes.dto.ChangePasswordResponse
import ru.iliya132.inotes.dto.SimpleUserDTO
import ru.iliya132.inotes.dto.UserDTO
import ru.iliya132.inotes.models.Avatar
import ru.iliya132.inotes.models.RegistrationResponse
import ru.iliya132.inotes.repositories.ImageRepository
import ru.iliya132.inotes.services.security.UserService
import ru.iliya132.inotes.utils.validation.CustomValidationException
import ru.iliya132.inotes.utils.validation.PasswordValidator
import java.security.Principal
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@RestController
@RequestMapping("/auth")
class UserController {
    @Autowired
    private lateinit var userService: UserService

    @Autowired
    private lateinit var imageRepository: ImageRepository

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

    @PatchMapping("/change-pass")
    fun changePassword(@RequestBody request: ChangePasswordRequest, principal: Principal): ResponseEntity<ChangePasswordResponse> {
        if (request.newPassword!=request.newPasswordConfirm) {
            return ResponseEntity.badRequest().body(ChangePasswordResponse(targets = arrayOf("new", "confirm"),
                message = "Новый пароль и подтверждение нового пароля не совпадают"))
        }
        if (!PasswordValidator.validatePassword(request.newPassword)) {
            return ResponseEntity.badRequest().body(ChangePasswordResponse(targets = arrayOf("new"),
                message = "Новый пароль не соответствует политике безопасности"))
        }
        val userId = userService.getUserId(principal)

        return userService.changePassword(userId, request.currentPassword, request.newPassword)
    }

    @PostMapping("/avatar")
    @Transactional
    fun uploadAvatar(@RequestBody avatar: MultipartFile, principal: Principal): Long {
        val user = userService.getUserFull(principal)
        if (imageRepository.existsByUserId(user.id)) {
            imageRepository.deleteByUserId(user.id)
        }
        val dbAvatar = Avatar(0, avatar.bytes, user.id)
        return imageRepository.save(dbAvatar).id
    }

    companion object {
        const val INVALID_USER_ATTRIBUTES = "Provided user is not valid"
    }
}
