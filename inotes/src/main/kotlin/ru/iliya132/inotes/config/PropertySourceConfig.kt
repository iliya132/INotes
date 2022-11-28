package ru.iliya132.inotes.config

import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.context.annotation.PropertySource
import org.springframework.context.annotation.PropertySources

@Configuration
@PropertySources(
    PropertySource("classpath:application.properties"),
    PropertySource("classpath:inotes.secrets.properties"),
    PropertySource("classpath:inotes.secrets-\${envTarget:default}.properties")
)
@Profile("!test")
class PropertySourceConfig
