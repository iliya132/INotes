package ru.iliya132.inotes.config


import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.orm.jpa.JpaTransactionManager
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean
import org.springframework.transaction.PlatformTransactionManager
import java.util.*
import javax.sql.DataSource


@Configuration
class DataSourceConfig {
    @Bean
    @ConfigurationProperties("inotes.sql")
    fun dataSourceProperties() : DataSourceProperties {
        return DataSourceProperties()
    }

    @Bean
    fun DataSource() :DataSource {
        return dataSourceProperties().initializeDataSourceBuilder().build()
    }

    @Bean
    fun jdbcTemplate(dataSource: DataSource) : JdbcTemplate {
        return JdbcTemplate(dataSource)
    }
}