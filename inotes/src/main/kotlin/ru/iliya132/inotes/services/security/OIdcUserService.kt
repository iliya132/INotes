package ru.iliya132.inotes.services.security

import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService
import org.springframework.security.oauth2.core.oidc.user.OidcUser
import org.springframework.stereotype.Service

@Service
class OIdcUserService(
    val userService: UserService
) : OAuth2UserService<OidcUserRequest, OidcUser> {
    override fun loadUser(userRequest: OidcUserRequest?): OidcUser {
        val oAuth2UserService = OidcUserService()
        val oAuth2User = oAuth2UserService.loadUser(userRequest)

        val registrationId = userRequest!!.clientRegistration.registrationId
        val userNameAttributeName = userRequest.clientRegistration.providerDetails.userInfoEndpoint
            .userNameAttributeName

        val attributes = mutableMapOf<String, Any>("registrationId" to registrationId, "userNameAttributeName" to userNameAttributeName)
        attributes.putAll(oAuth2User.attributes)

        val userName = attributes[userNameAttributeName] as String
        val authProvider = userRequest.clientRegistration.clientName

        return if (userService.isExists(userName)) {
            userService.getUserFull(userName)
        } else {
            val newUser = SecurityUtils.extractUser(attributes, authProvider, userName)
            userService.register(newUser)
            newUser
        }
    }

}