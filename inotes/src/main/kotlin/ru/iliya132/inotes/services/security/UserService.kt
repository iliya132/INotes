package ru.iliya132.inotes.services.security

import org.springframework.beans.factory.annotation.Value
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.oauth2.core.user.DefaultOAuth2User
import ru.iliya132.inotes.dto.ChangePasswordResponse
import ru.iliya132.inotes.dto.SimpleUserDTO
import ru.iliya132.inotes.dto.UserDTO
import ru.iliya132.inotes.models.RegistrationResponse
import ru.iliya132.inotes.models.User
import ru.iliya132.inotes.repositories.ImageRepository
import ru.iliya132.inotes.repositories.RolesRepository
import ru.iliya132.inotes.repositories.UserRepository
import java.security.Principal
import javax.servlet.http.HttpServletRequest

open class UserService(
    val userRepository: UserRepository,
    val rolesRepository: RolesRepository,
    val imageRepository: ImageRepository,
    open val encoder: PasswordEncoder
) {
    @Value("\${i-note.host-address}")
    val host: String? = null

    @Value("\${i-note.frontend.url}")
    val frontendUrl: String? = null

    open fun register(user: UserDTO): RegistrationResponse {
        if (isExists(user.userName)) {
            return RegistrationResponse(false, null, "Пользователь с таким логином уже зарегистрирован в системе")
        }
        val newUser =
            User(
                0, user.userName, encoder.encode(user.password), false, rolesRepository.findByName
                    ("ROLE_USER"), user.externalUserName
            )
        newUser.externalDefaultEmail = newUser.userName
        userRepository.save(newUser)
        return RegistrationResponse(true, SimpleUserDTO(newUser.userName, newUser.roles.map { it.name }, null), null)
    }

    fun register(user: User): RegistrationResponse {
        if (isExists(user.userName)) {
            return RegistrationResponse(false, null, "Пользователь с таким логином уже зарегистрирован в системе")
        }
        userRepository.save(user)
        return RegistrationResponse(true, SimpleUserDTO(user.userName, user.roles.map { it.name }, null), null)
    }

    fun findById(userId: Long): User {
        return userRepository.findById(userId).orElseThrow()
    }

    fun changePassword(userId: Long, newPassword: String) {
        val user = userRepository.findById(userId).orElseThrow()
        val encodedPassword = encoder.encode(newPassword)
        user.password = encodedPassword
        userRepository.changePassword(encodedPassword, user.id)
    }

    fun changePassword(userId: Long, oldPassword: String, password: String): ResponseEntity<ChangePasswordResponse> {

        val user = userRepository.findById(userId).orElseThrow()
        if (!validatePassword(user, oldPassword)) {
            return ResponseEntity.badRequest().body(ChangePasswordResponse(targets = arrayOf("old"), message =
            "Неверно указан текущий пароль"))
        }
        user.password = encoder.encode(password)
        userRepository.changePassword(encoder.encode(password), user.id)
        return ResponseEntity.ok().build()
    }

    open fun isExists(userName: String): Boolean {
        return userRepository.existsByUserName(userName)
    }

    fun getUser(auth: Authentication, request: HttpServletRequest): SimpleUserDTO {
        val user = auth.principal as User
        val dbUser = userRepository.findByUserName(user.username)

        val avatar = if (dbUser==null) NULL_AVATAR else imageRepository.findFirstIdByUserId(dbUser.id).orElse(NULL_AVATAR)
        return SimpleUserDTO(user.displayName
            ?: user.userName, user.authorities.map { it.authority }, generateAvatarUrl(avatar))
    }

    private fun generateAvatarUrl(avatarId: Long): String {
        if (avatarId==NULL_AVATAR) {
            return "${frontendUrl}avatar.png"
        }
        return "$host/api/static/img/$avatarId"
    }

    fun getUserFull(auth: Authentication): User {
        return getUserFull(auth.name)
    }

    fun getUserFull(userName: String): User {
        return userRepository.findByUserName(userName) ?: throw NotFoundException()
    }

    fun getUserId(auth: Authentication): Long {
        if (auth.principal is User) {
            return userRepository.findFirstIdByUserName(auth.name) ?: throw NotFoundException()
        } else if (auth.principal is DefaultOAuth2User) {
            return userRepository.findFirstIdByExternalUserName(auth.name) ?: throw NotFoundException()
        } else {
            throw Exception("Invalid user type")
        }
    }

    fun validatePassword(user: User, currentPassword: String): Boolean {
        return encoder.matches(currentPassword, user.password)
    }

    companion object {
        private val NULL_AVATAR: Long = -1L
    }

    open fun getUser(principal: Principal, request: HttpServletRequest): SimpleUserDTO {
        TODO("Not yet implemented")
    }

    open fun getUserFull(principal: Principal): User {
        TODO("Not yet implemented")
    }
}
