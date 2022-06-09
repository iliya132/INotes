package ru.iliya132.inotes.config

import org.testcontainers.containers.PostgreSQLContainer

class TestPostgresqlContainer : PostgreSQLContainer<TestPostgresqlContainer>("postgres:11.1") {
    override fun start() {
        super.start()
        System.setProperty("DB_URL", container!!.jdbcUrl)
        System.setProperty("DB_USERNAME", container!!.username)
        System.setProperty("DB_PASSWORD", container!!.password)
    }

    override fun stop() {}

    companion object {
        private var container: TestPostgresqlContainer? = null
        fun getInstance(): TestPostgresqlContainer {
            if (container == null) {
                container = TestPostgresqlContainer()
            }
            return container!!
        }
    }
}
