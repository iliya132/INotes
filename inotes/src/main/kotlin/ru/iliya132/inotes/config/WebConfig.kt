package ru.iliya132.inotes.config

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.EnableWebMvc
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer


@Configuration
@EnableWebMvc
class WebConfig : WebMvcConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/**").allowedOrigins("http://localhost:3000", "http://localhost:80",
            "https://localhost:443", "https://i-note.online", "http://i-note.online")
            .allowedMethods("POST", "GET", "OPTIONS", "DELETE", "PUT", "PATCH")
    }
}
