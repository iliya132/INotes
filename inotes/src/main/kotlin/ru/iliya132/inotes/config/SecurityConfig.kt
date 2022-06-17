package ru.iliya132.inotes.config

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler
import org.springframework.web.cors.CorsConfiguration
import ru.iliya132.inotes.security.AppAuthFailHandler
import ru.iliya132.inotes.security.AppAuthSuccessHandler
import ru.iliya132.inotes.security.AppLogoutSuccessHandler
import ru.iliya132.inotes.security.AuthEntryPoint
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
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }

    @Bean
    fun appAuthSuccessHandler(): AppAuthSuccessHandler? {
        return AppAuthSuccessHandler()
    }

    @Bean
    fun appAuthFailureHandler(): AppAuthFailHandler {
        return AppAuthFailHandler()
    }

    @Bean
    fun appLogoutSuccessHandler(): LogoutSuccessHandler {
        return AppLogoutSuccessHandler()
    }

    @Bean
    fun authEntryPoint(): AuthenticationEntryPoint {
        return AuthEntryPoint()
    }

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http.csrf().disable()
            .cors().configurationSource {
                val config = CorsConfiguration()
                config.allowedOrigins = ALLOWED_ORIGINS
                config.allowCredentials = true
                config.allowedMethods = listOf("*")
                config.addAllowedHeader("*")
                config
            }
            .and()
            .authorizeRequests()
            .antMatchers("/api*").hasRole("user")
            .antMatchers("/auth/login*").permitAll()
            .antMatchers("/auth/register*").permitAll()
            .anyRequest().authenticated()
            .and()
            .formLogin()
            .loginProcessingUrl("/auth/login")
            .successHandler(appAuthSuccessHandler())
            .failureHandler(appAuthFailureHandler())
            .and()
            .logout().logoutUrl("/auth/logout").permitAll().logoutSuccessHandler(appLogoutSuccessHandler())
            .invalidateHttpSession(true)
            .deleteCookies("JSESSIONID", "SESSION")
            .and()
            .exceptionHandling()
            .authenticationEntryPoint(authEntryPoint())
            .and()
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
        return http.build()
    }

    companion object {
        val log = LoggerFactory.getLogger(SecurityConfig::class.java)
        val ALLOWED_ORIGINS = listOf("http://localhost:3000", "http://localhost:80", "https://localhost:443",
            "http://i-note.online", "https://i-note.online", "https://www.i-note.online", "http://www.i-note.online")
    }
}
