package ru.iliya132.inotes.controller

import org.springframework.test.context.ActiveProfiles
import org.testcontainers.shaded.com.fasterxml.jackson.databind.ObjectMapper

@ActiveProfiles("test")
abstract class BaseControllerTest {
    val objectMapper = ObjectMapper()

    companion object {
        const val AUTH_URL = "/auth"
        const val NOTEBOOK_API_URL = "/api/notebook"
        const val defaultUserName = "defaultUser@test.ru"

    }
}