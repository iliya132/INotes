package ru.iliya132.inotes.controller

import com.github.dockerjava.zerodep.shaded.org.apache.hc.client5.http.entity.UrlEncodedFormEntity
import com.github.dockerjava.zerodep.shaded.org.apache.hc.core5.http.io.entity.EntityUtils
import com.github.dockerjava.zerodep.shaded.org.apache.hc.core5.http.message.BasicNameValuePair
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.security.test.context.support.WithUserDetails
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import ru.iliya132.inotes.config.SecurityConfig
import ru.iliya132.inotes.config.TestAuthConfig
import ru.iliya132.inotes.dto.UserDTO
import ru.iliya132.inotes.services.security.UserService


@RunWith(SpringRunner::class)
@Import(TestAuthConfig::class, SecurityConfig::class)
@WebMvcTest(UserController::class)
class UserControllerTests : BaseControllerTest() {
    @Autowired
    lateinit var mvcMock: MockMvc

    val expectedUserError = UserController.INVALID_USER_ATTRIBUTES

    @Autowired
    lateinit var userService: UserService

    @Test
    fun `can register`() {
        val testUser = UserDTO("canRegister@test.ru", "canRegister123!")
        buildRegisterRequest(testUser)
            .andDo { println() }
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.succeeded").value(true))
    }

    @Test
    fun `can login`() {
        val testUser = UserDTO("canLogin@test.ru", "canLogin123&")
        buildRegisterRequest(testUser)

        buildLoginRequest(testUser.userName, testUser.password)
            .andExpect(status().isOk)
    }

    @Test
    fun `can't login with wrong credentials`() {
        val testUser = UserDTO("cantLoginWithWrongCredentials@test.ru", "cantLoginWithWrongCredentials123&")
        //doesnt registered
        assert(
            buildLoginRequest(testUser.userName, testUser.password)
                .andExpect(status().isUnauthorized)
                .andReturn()
                .response.contentAsString=="wrong credentials"
        )
    }

    @Test
    fun `can't register without credentials`() {
        buildRegisterRequest(null)
            .andDo { println() }
            .andExpect(status().isBadRequest)
    }

    @Test
    fun `can't register with invalid password`() {
        val invalidPasswordUser = UserDTO("cantRegister@test.ru", "qwe")

        assert(buildRegisterRequest(invalidPasswordUser)
            .andDo { println() }
            .andReturn()
            .response.contentAsString==expectedUserError)
    }

    @Test
    fun `can't register with invalid email`() {
        val invalidEmailUser = UserDTO("cantRegister", "cantRegister123&")
        assert(buildRegisterRequest(invalidEmailUser)
            .andDo { println() }
            .andReturn()
            .response.contentAsString==expectedUserError)
    }

    @Test
    fun `cant register without email`() {
        val noEmailUser = UserDTO("", "cantRegister123&")
        assert(buildRegisterRequest(noEmailUser)
            .andDo { println() }
            .andReturn()
            .response.contentAsString==expectedUserError)
    }

    @Test
    fun `cant register without password`() {
        val noPasswordUser = UserDTO("cantRegisterWithoutPassword@test.ru", "")
        assert(
            buildRegisterRequest(noPasswordUser)
                .andDo { println() }
                .andExpect(status().isBadRequest)
                .andReturn()
                .response.contentAsString==expectedUserError
        )
    }

    @Test
    fun `can't register same user`() {
        val testUser = UserDTO("cantRegisterSameUser@test.ru", "cantRegisterSameUser123!")
        buildRegisterRequest(testUser)
            .andDo { println() }
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.succeeded").value(true))

        buildRegisterRequest(testUser)
            .andDo { println() }
            .andExpect(status().isBadRequest)
            .andExpect(jsonPath("$.succeeded").value(false))
            .andExpect(jsonPath("$.error").value("Пользователь с таким логином уже зарегистрирован в системе"))
    }

    @Test
    @WithUserDetails(defaultUserName)
    fun `can get current user data`() {

        mvcMock.perform(
            MockMvcRequestBuilders.get("$AUTH_URL/user")
        )
            .andExpect(status().isOk)
            .andExpect { content().contentType(MediaType.APPLICATION_JSON) }
            .andExpect { content().json("{\"userName\":\"defaultUser@test.ru\",\"roles\":[]}") }
    }

    private fun buildRegisterRequest(user: UserDTO?): ResultActions {
        val json = objectMapper.writeValueAsString(user)
        return mvcMock.perform(
            MockMvcRequestBuilders.post("$AUTH_URL/register")
                .content(json)
                .contentType(MediaType.APPLICATION_JSON)
        )
    }

    private fun buildLoginRequest(username: String, password: String): ResultActions {
        return mvcMock.perform(MockMvcRequestBuilders.post("$AUTH_URL/login")
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .content(EntityUtils.toString(UrlEncodedFormEntity(listOf(
                BasicNameValuePair("username", username),
                BasicNameValuePair("password", password))
            )))
        )
    }
}

