package ru.iliya132.inotes.services.security

import org.springframework.beans.factory.annotation.Value
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import ru.iliya132.inotes.dto.ChangePasswordResponse
import ru.iliya132.inotes.dto.SimpleUserDTO
import ru.iliya132.inotes.dto.UserDTO
import ru.iliya132.inotes.models.RegistrationResponse
import ru.iliya132.inotes.models.User
import ru.iliya132.inotes.repositories.ImageRepository
import ru.iliya132.inotes.repositories.RolesRepository
import ru.iliya132.inotes.repositories.UserRepository
import java.security.Principal

@Service
class UserService(
    val userRepository: UserRepository,
    val rolesRepository: RolesRepository,
    val imageRepository: ImageRepository,
    val encoder: PasswordEncoder
) {
    @Value("\${i-note.host-address}")
    val host: String? = null

    fun register(user: UserDTO): RegistrationResponse {
        if (isExists(user.userName)) {
            return RegistrationResponse(false, "Пользователь с таким логином уже зарегистрирован в системе")
        }
        val newUser =
            User(
                0, user.userName, encoder.encode(user.password), true, rolesRepository.findByName
                    ("ROLE_USER")
            )
        userRepository.save(newUser)
        return RegistrationResponse(true, null)
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

    private fun isExists(userName: String): Boolean {
        return userRepository.existsByUserName(userName)
    }

    fun getUser(principal: Principal): SimpleUserDTO {
        val user = userRepository.findByUserName(principal.name) ?: throw NotFoundException()
        val avatar = imageRepository.findFirstIdByUserId(user.id).orElse(-1)
        return SimpleUserDTO(user.username, user.authorities.map { it.authority }, generateAvatarUrl(avatar))
    }

    private fun generateAvatarUrl(avatarId: Long): String {
        return "$host/api/static/img/$avatarId"
    }

    fun getUserFull(principal: Principal): User {
        return userRepository.findByUserName(principal.name) ?: throw NotFoundException()
    }

    fun getUserId(principal: Principal): Long {
        return userRepository.findFirstIdByUserName(principal.name) ?: throw NotFoundException()
    }

    fun validatePassword(user: User, currentPassword: String): Boolean {
        return encoder.matches(currentPassword, user.password)
    }
}
