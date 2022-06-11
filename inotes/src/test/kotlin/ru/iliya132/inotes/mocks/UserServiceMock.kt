package ru.iliya132.inotes.mocks

import org.mockito.Mockito
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import ru.iliya132.inotes.dto.SimpleUserDTO
import ru.iliya132.inotes.dto.UserDTO
import ru.iliya132.inotes.models.RegistrationResponse
import ru.iliya132.inotes.models.Role
import ru.iliya132.inotes.models.User
import ru.iliya132.inotes.repositories.RolesRepository
import ru.iliya132.inotes.repositories.UserRepository
import ru.iliya132.inotes.services.security.UserService
import java.security.Principal

class UserServiceMock : UserService(
	Mockito.mock(UserRepository::class.java),
	Mockito.mock(RolesRepository::class.java),
	Mockito.mock(PasswordEncoder::class.java)
                                   ) {
	val cache = HashMap<String, User>()
	override val encoder = BCryptPasswordEncoder()

	override fun register(user: UserDTO): RegistrationResponse {
		if (isExists(user.userName)) {
			return RegistrationResponse(false, "Пользователь с таким логином уже зарегистрирован в системе")
		}
		val newUser =
			User(
				0, user.userName, encoder.encode(user.password), true, listOf(Role(0, "ROLE_USER"))
			    )
		cache[user.userName] = newUser
		return RegistrationResponse(true, null)
	}

	override fun getUser(principal: Principal): SimpleUserDTO {
		val user = cache[principal.name] ?: throw NotFoundException()
		return SimpleUserDTO(user.username, user.authorities.map { it.authority })
	}

	override fun getUserFull(principal: Principal): User {
		return cache[principal.name] ?: throw NotFoundException()
	}

	private fun isExists(userName: String): Boolean {
		return cache.containsKey(userName)
	}
}
