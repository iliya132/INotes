package ru.iliya132.inotes

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.PropertySource
import org.springframework.context.annotation.PropertySources

@SpringBootApplication
class InotesApplication

fun main(args: Array<String>) {
    runApplication<InotesApplication>(*args)
}
