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
import ru.iliya132.inotes.services.security.UserDetailsService

@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Autowired
    lateinit var userDetailsService: UserDetailsService

    @Autowired
    @Throws(Exception::class)
    fun configureGlobal(auth: AuthenticationManagerBuilder) {
        auth.userDetailsService(userDetailsService)
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder? {
        return BCryptPasswordEncoder()
    }

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http.csrf().disable()
            .authorizeRequests()
            .antMatchers("/api*").hasRole("user")
            .antMatchers("/auth/login*").permitAll()
            .anyRequest().authenticated()
            .and()
            .formLogin()
            .loginProcessingUrl("/auth/login")
            .and().logout().logoutUrl("/auth/logout")
            .deleteCookies("JSESSIONID")
        return http.build()
    }

}