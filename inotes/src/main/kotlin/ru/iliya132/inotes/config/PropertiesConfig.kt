package ru.iliya132.inotes.config

import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.context.annotation.PropertySource

@Configuration
@Profile("!test")
@PropertySource("classpath:inotes.secrets.yaml")
class PropertiesConfig {
}
