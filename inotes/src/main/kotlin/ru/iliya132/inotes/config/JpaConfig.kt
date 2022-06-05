package ru.iliya132.inotes.config

import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.orm.jpa.JpaTransactionManager
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean
import org.springframework.transaction.PlatformTransactionManager
import javax.sql.DataSource

@Configuration
class JpaConfig {
    @Bean
    fun entityManagerFactory(dataSource: DataSource, entityManagerFactoryBuilder: EntityManagerFactoryBuilder) : LocalContainerEntityManagerFactoryBean {
        return entityManagerFactoryBuilder.dataSource(dataSource)
            .packages("ru.iliya132.inotes.models")
            .build()
    }

    @Bean
    fun transactionManager(entityManagerFactory: LocalContainerEntityManagerFactoryBean) : PlatformTransactionManager {
        return JpaTransactionManager(entityManagerFactory.`object`!!)
    }
}