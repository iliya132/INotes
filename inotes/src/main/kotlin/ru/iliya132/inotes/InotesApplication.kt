package ru.iliya132.inotes

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class InotesApplication

fun main(args: Array<String>) {
	runApplication<InotesApplication>(*args)
}
