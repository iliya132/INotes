package ru.iliya132.inotes

import org.junit.ClassRule
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import org.testcontainers.containers.PostgreSQLContainer
import ru.iliya132.inotes.config.TestPostgresqlContainer


@SpringBootTest
@ActiveProfiles("test")
abstract class BaseDbTest {
	companion object {
		@ClassRule
		@JvmField
		var postgreSqlContainer: PostgreSQLContainer<*> = TestPostgresqlContainer.getInstance()
	}
}