package ru.iliya132.inotes.services.security

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import ru.iliya132.inotes.dto.UserDTO
import ru.iliya132.inotes.dto.UserLoginDTO
import ru.iliya132.inotes.models.RegistrationResponse
import ru.iliya132.inotes.models.User
import ru.iliya132.inotes.repositories.RolesRepository
import ru.iliya132.inotes.repositories.UserRepository

@Service
class UserService {

    @Autowired
    lateinit var userRepository: UserRepository

    @Autowired
    lateinit var rolesRepository: RolesRepository


    fun register(user: UserDTO): RegistrationResponse {
        if (isExists(user.userName)) {
            return RegistrationResponse(false, "registration is not implemented yet")

        }
        val newUser = User(0, user.userName, user.password, true, rolesRepository.findByName("USER"))
        userRepository.save(newUser)
        return RegistrationResponse(true, null)
    }

    fun login(user: UserLoginDTO){

    }

    private fun isExists(userName: String): Boolean {
        return userRepository.existsByUserName(userName)
    }

    fun tryToLogin(userLoginDTO: UserLoginDTO) {

    }
}