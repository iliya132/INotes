package ru.iliya132.inotes.config

import liquibase.Contexts
import liquibase.Liquibase
import liquibase.database.DatabaseFactory
import liquibase.database.jvm.JdbcConnection
import liquibase.resource.ClassLoaderResourceAccessor
import org.junit.ClassRule
import org.springframework.boot.jdbc.DataSourceBuilder
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.context.annotation.Profile
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter
import org.testcontainers.containers.PostgreSQLContainer
import javax.persistence.PersistenceContext
import javax.sql.DataSource

@Configuration
@EnableJpaRepositories(
    basePackages = ["ru.iliya132.inotes.repositories"],
    entityManagerFactoryRef = "entityManager",
    transactionManagerRef = "transactionManager"
)
@Profile("test")
class TestEmbeddedPostgresqlConfig() {
    init {
        postgreSqlContainer.start()
        val database = DatabaseFactory.getInstance().findCorrectDatabaseImplementation(
            JdbcConnection(
                postgreSqlContainer.createConnection("?")
            )
        )
        Liquibase("classpath:db/changelog/changelog.xml", ClassLoaderResourceAccessor(), database)
            .update(Contexts())
    }

    @Bean
    fun dataSource(): DataSource {
        return DataSourceBuilder.create()
            .url(postgreSqlContainer.jdbcUrl)
            .driverClassName(postgreSqlContainer.driverClassName)
            .username(postgreSqlContainer.username)
            .password(postgreSqlContainer.password)
            .build()
    }

    @Bean
    fun entityManagerFactoryBuilder(): EntityManagerFactoryBuilder? {
        return EntityManagerFactoryBuilder(HibernateJpaVendorAdapter(), HashMap<String, Any?>(), null)
    }

    @PersistenceContext(unitName = "primary")
    @Primary
    @Bean(name = ["entityManager"])
    fun entityManagerFactory(entityManagerFactoryBuilder: EntityManagerFactoryBuilder): LocalContainerEntityManagerFactoryBean? {
        return entityManagerFactoryBuilder.dataSource(dataSource()).persistenceUnit("primary")
            .properties(jpaProperties())
            .packages("ru.iliya132.inotes.models").build()
    }

    private fun jpaProperties(): Map<String, Any>? {
        return HashMap()
    }

    @Bean
    fun jdbcTemplate(dataSource: DataSource): JdbcTemplate {
        return JdbcTemplate(dataSource)
    }

    companion object {
        @ClassRule
        @JvmField
        var postgreSqlContainer: PostgreSQLContainer<*> = TestPostgresqlContainer.getInstance()
    }
}
