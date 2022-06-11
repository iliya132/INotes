package ru.iliya132.inotes.controller

import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.security.test.context.support.WithUserDetails
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import ru.iliya132.inotes.config.SecurityConfig
import ru.iliya132.inotes.config.TestAuthConfig
import ru.iliya132.inotes.dto.UserDTO
import ru.iliya132.inotes.services.security.UserService

@RunWith(SpringRunner::class)
@WebMvcTest(HealthController::class)
@Import(TestAuthConfig::class, SecurityConfig::class)
class HealthControllerTest : BaseControllerTest() {
    @Autowired
    lateinit var mvcMock: MockMvc

    @Autowired
    lateinit var usersService: UserService

    @Before
    fun startup() {
        usersService.register(UserDTO("testUser@test.ru", "testPassword123"))
    }

    @Test
    @WithUserDetails("testUser@test.ru")
    fun `should answer pong`() {
        mvcMock.get("/api/health/ping")
            .andExpect { status { isOk() } }
            .andExpect { content { string("pong") } }
    }

    @Test
    fun `when not authenticated should answer 401`() {
        mvcMock.get("/api/health/ping")
            .andExpect { status { isForbidden() } }
    }
}