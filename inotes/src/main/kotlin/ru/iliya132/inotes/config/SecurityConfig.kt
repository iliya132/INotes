package ru.iliya132.inotes.config

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler
import org.springframework.web.cors.CorsConfiguration
import ru.iliya132.inotes.security.AppAuthFailHandler
import ru.iliya132.inotes.security.AppAuthSuccessHandler
import ru.iliya132.inotes.security.AppLogoutSuccessHandler
import ru.iliya132.inotes.security.AuthEntryPoint
import ru.iliya132.inotes.services.security.OAuthUserService
import ru.iliya132.inotes.services.security.OIdcUserService
import ru.iliya132.inotes.services.security.UserDetailsService
import ru.iliya132.inotes.services.security.UserService

@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Autowired
    lateinit var userDetailsService: UserDetailsService

    @Autowired
    lateinit var userService: UserService

    @Value("#{'\${i-note.allowed-origins}'.split(',')}")
    lateinit var allowedOrigins: List<String>

    @Value("\${i-note.remember-me.key}")
    val rememberMeKey: String = "test-key"

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
    fun oauthUserService(): OAuthUserService {
        return OAuthUserService(userService)
    }

    @Bean
    fun oidcUserService(): OIdcUserService {
        return OIdcUserService(userService)
    }

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http.csrf().disable()
            .cors().configurationSource {
                val config = CorsConfiguration()
                config.allowedOrigins = allowedOrigins
                config.allowCredentials = true
                config.allowedMethods = listOf("*")
                config.addAllowedHeader("*")
                config
            }
            .and()
            .authorizeRequests()
            .antMatchers("/api/login*").permitAll()
            .antMatchers("/api*").hasRole("user")
            .antMatchers("/api/login/*").permitAll()
            .antMatchers("/api/notebook/shared-note/*").permitAll()
            .antMatchers("/auth/forgot-password/**").permitAll()
            .antMatchers("/auth/restore-password/**").permitAll()
            .antMatchers("/auth/validate").permitAll()
            .antMatchers("/auth/register").permitAll()

            .antMatchers("/login*").permitAll()
            .antMatchers("/oauth2*").permitAll()
            .antMatchers("/", "/error**").permitAll()
            .anyRequest().authenticated()
            .and()
            .formLogin()
            .loginProcessingUrl("/auth/login")
            .successHandler(appAuthSuccessHandler())
            .failureHandler(appAuthFailureHandler())
            .and()
            .oauth2Login {
                it.defaultSuccessUrl("http://localhost:3000/login")
                it.successHandler(appAuthSuccessHandler())
                it.failureHandler(appAuthFailureHandler())
                it.userInfoEndpoint().userService(oauthUserService())
                it.userInfoEndpoint().oidcUserService(oidcUserService())
            }
            .logout().logoutUrl("/auth/logout").permitAll().logoutSuccessHandler(appLogoutSuccessHandler())
            .invalidateHttpSession(true)
            .deleteCookies("JSESSIONID", "SESSION")
            .and()
            .rememberMe()
            .key(rememberMeKey)
            .alwaysRemember(true)
            .and()
            .exceptionHandling()
            .authenticationEntryPoint(authEntryPoint())
            .and()
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            .and()
            .headers().httpStrictTransportSecurity().includeSubDomains(true).maxAgeInSeconds(31536000)
        return http.build()
    }

    companion object {
        val ALLOWED_ORIGINS = listOf("http://localhost:3000", "http://localhost:80", "https://localhost:443",
            "http://notes.iliya132apps.ru", "https://notes.iliya132apps.ru")
    }
}
