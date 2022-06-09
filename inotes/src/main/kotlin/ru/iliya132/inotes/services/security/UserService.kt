package ru.iliya132.inotes.services.security

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import ru.iliya132.inotes.dto.SimpleUserDTO
import ru.iliya132.inotes.dto.UserDTO
import ru.iliya132.inotes.models.RegistrationResponse
import ru.iliya132.inotes.models.User
import ru.iliya132.inotes.repositories.RolesRepository
import ru.iliya132.inotes.repositories.UserRepository
import java.security.Principal

@Service
class UserService {

    @Autowired
    private lateinit var userRepository: UserRepository

    @Autowired
    private lateinit var rolesRepository: RolesRepository

    @Autowired
    private lateinit var encoder: PasswordEncoder

    fun register(user: UserDTO): RegistrationResponse {
        if (isExists(user.userName)) {
            return RegistrationResponse(false, "Пользователь с таким логином уже зарегистрирован в системе")
        }
        val newUser =
            User(
                0, user.userName, encoder.encode(user.password), true, rolesRepository.findByName("ROLE_USER")
            )
        userRepository.save(newUser)
        return RegistrationResponse(true, null)
    }

    private fun isExists(userName: String): Boolean {
        return userRepository.existsByUserName(userName)
    }

    fun getUser(principal: Principal): SimpleUserDTO {
        val user = userRepository.findByUserName(principal.name) ?: throw NotFoundException()
        return SimpleUserDTO(user.username, user.authorities.map { it.authority })
    }
}
