package ru.iliya132.inotes.controller

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import ru.iliya132.inotes.dto.ChangePasswordRequest
import ru.iliya132.inotes.dto.ChangePasswordResponse
import ru.iliya132.inotes.dto.SimpleUserDTO
import ru.iliya132.inotes.dto.UserDTO
import ru.iliya132.inotes.models.Avatar
import ru.iliya132.inotes.models.RegistrationResponse
import ru.iliya132.inotes.models.VerificationType
import ru.iliya132.inotes.repositories.ImageRepository
import ru.iliya132.inotes.services.EmailService
import ru.iliya132.inotes.services.security.UserService
import ru.iliya132.inotes.utils.validation.CustomValidationException
import ru.iliya132.inotes.utils.validation.PasswordValidator
import java.time.LocalDateTime
import java.util.*
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@RestController
@RequestMapping("/auth")
class UserController {
    @Autowired
    private lateinit var userService: UserService

    @Autowired
    private lateinit var imageRepository: ImageRepository

    @Autowired
    private lateinit var emailService: EmailService

    @Value("\${i-note.host-address}")
    val host: String? = null

    @Value("\${i-note.frontend.url}")
    val frontendUrl: String? = null

    @GetMapping("/user")
    fun retrievePrincipal(auth: Authentication, request: HttpServletRequest): SimpleUserDTO {
        return userService.getUser(auth, request)
    }

    @GetMapping("/forgot-password/{userName}")
    fun forgotPassword(@PathVariable userName: String): ResponseEntity<String> {
        if (userService.isExists(userName)) {
            val verificationCode = UUID.randomUUID().toString()
            var user = userService.getUserFull(userName)
            user.verificationCode = verificationCode
            user.verificationType = VerificationType.RESTORE_PASSWORD
            user.verificationCodeExpireAt = LocalDateTime.now().plusDays(1)
            user = userService.userRepository.save(user)
            sendRestoreMessage(user.externalDefaultEmail, user.id, verificationCode)
        }
        return ResponseEntity.ok().build()
    }

    @GetMapping("/validate")
    fun validateAuth(auth: Authentication?): ResponseEntity<Boolean> {
        if (auth==null || !auth.isAuthenticated) {
            return ResponseEntity.ok(false)
        }
        return ResponseEntity.ok(true)
    }

    private fun sendRestoreMessage(email: String, userId: Long, verificationCode: String) {
        emailService.sendSimpleMessage(email, "Восстановление пароля",
            "Вы запросили восстановление доступа к вашему аккаунту на i-note.online\n" +
                    "Для продолжения - перейдите по ссылке ${frontendUrl}restore-password/$userId/$verificationCode \n" +
                    "Ссылка активна в течении суток.\n\n" +
                    "Если вы не запрашивали это письмо - просто удалите его.\n" +
                    "С уважением, I-Note")
    }

    @PostMapping("/restore-password/{userId}/{verificationCode}")
    fun restorePassword(@PathVariable userId: Long, @PathVariable verificationCode: String,
                        @RequestBody newPassword: String): ResponseEntity<String> {
        var user = userService.findById(userId)
        val isVCEquals = verificationCode==user.verificationCode
        val isVCExpired = user.verificationCodeExpireAt!=null &&
                user.verificationCodeExpireAt!!.isBefore(LocalDateTime.now())
        val isVCTypeValid = user.verificationType==VerificationType.RESTORE_PASSWORD
        if (!isVCEquals) {
            return ResponseEntity.badRequest().body("Указан не верный код подтверждения. Запросите код повторно")
        }
        if (isVCExpired) {
            return ResponseEntity.badRequest().body("Срок действия кода подтверждения истек. Запросите код повторно")
        }

        if (!isVCTypeValid) {
            return ResponseEntity.badRequest().body("Код подтверждения невалиден. Запросите код повторноя")
        }

        if (!PasswordValidator.validatePassword(newPassword)) {
            return ResponseEntity.badRequest().body("Новый пароль не соответствует политике безопасности")
        }
        userService.changePassword(userId, newPassword)
        user = userService.findById(userId)
        user.verificationCode = null
        user.verificationCodeExpireAt = null
        user.verificationType = null
        userService.userRepository.save(user)
        return ResponseEntity.ok("Пароль успешно изменен")
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
    fun changePassword(@RequestBody request: ChangePasswordRequest, auth: Authentication): ResponseEntity<ChangePasswordResponse> {
        if (request.newPassword!=request.newPasswordConfirm) {
            return ResponseEntity.badRequest().body(ChangePasswordResponse(targets = arrayOf("new", "confirm"),
                message = "Новый пароль и подтверждение нового пароля не совпадают"))
        }
        if (!PasswordValidator.validatePassword(request.newPassword)) {
            return ResponseEntity.badRequest().body(ChangePasswordResponse(targets = arrayOf("new"),
                message = "Новый пароль не соответствует политике безопасности"))
        }
        val userId = userService.getUserId(auth)

        return userService.changePassword(userId, request.currentPassword, request.newPassword)
    }

    @PostMapping("/avatar")
    @Transactional
    fun uploadAvatar(@RequestBody avatar: MultipartFile, auth: Authentication): Long {
        val user = userService.getUserFull(auth)
        if (imageRepository.existsByUserId(user.id)) {
            imageRepository.deleteByUserId(user.id)
        }
        val dbAvatar = Avatar(0, avatar.bytes, user.id)
        return imageRepository.save(dbAvatar).id
    }

    companion object {
        const val INVALID_USER_ATTRIBUTES = "Provided user is not valid"
        val log = LoggerFactory.getLogger(UserController::class.java)
    }
}
