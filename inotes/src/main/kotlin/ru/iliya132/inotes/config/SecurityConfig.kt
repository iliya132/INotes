package ru.iliya132.inotes.config

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import javax.sql.DataSource

@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Autowired
    lateinit var dataSource: DataSource

    @Autowired
    @Throws(Exception::class)
    fun configureGlobal(auth: AuthenticationManagerBuilder) {
        auth.jdbcAuthentication()
            .dataSource(dataSource)
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder? {
        return BCryptPasswordEncoder()
    }

    @Throws(java.lang.Exception::class)
    protected fun configure(http: HttpSecurity) {
        http.authorizeRequests()
            .antMatchers("/h2-console/**")
            .permitAll()
            .anyRequest()
            .authenticated()
            .and()
            .formLogin()
        http.csrf()
            .ignoringAntMatchers("/h2-console/**")
        http.headers()
            .frameOptions()
            .sameOrigin()
    }

   @Bean
   @Throws(Exception::class)
   fun filterChain(http: HttpSecurity): SecurityFilterChain? {
       http.authorizeRequests()
           .antMatchers("/h2-console/**")
           .permitAll()
           .anyRequest()
           .authenticated()
           .and()
           .formLogin()
       http.csrf()
           .ignoringAntMatchers("/h2-console/**")
       http.headers()
           .frameOptions()
           .sameOrigin()
       return http.build()
   }
//
//
//    @Bean
//    fun users(dataSource: DataSource?): UserDetailsManager? {
//        val user: UserDetails = User.withDefaultPasswordEncoder()
//            .username("user")
//            .password("password")
//            .roles("USER")
//            .build()
//        val users = JdbcUserDetailsManager(dataSource)
//        users.createUser(user)
//        return users
//    }
//
//    @Bean
//    fun passwordEncoder(): PasswordEncoder? {
//        return BCryptPasswordEncoder()
//    }
}