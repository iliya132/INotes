package ru.iliya132.inotes.services.security

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService
import org.springframework.security.oauth2.core.user.OAuth2User
import org.springframework.stereotype.Service

@Service
class OAuthUserService(
    val userService: UserService
) : OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    override fun loadUser(userRequest: OAuth2UserRequest?): OAuth2User {
        val oAuth2UserService: OAuth2UserService<OAuth2UserRequest, OAuth2User> = DefaultOAuth2UserService()
        val oAuth2User = oAuth2UserService.loadUser(userRequest)

        val registrationId = userRequest!!.clientRegistration.registrationId
        val userNameAttributeName = userRequest.clientRegistration.providerDetails.userInfoEndpoint
            .userNameAttributeName

        val attributes = mutableMapOf<String, Any>("registrationId" to registrationId, "userNameAttributeName" to userNameAttributeName)
        attributes.putAll(oAuth2User.attributes)

        val userName = attributes[userNameAttributeName] as String
        val authProvider = userRequest.clientRegistration.clientName

        return if (userService.isExistsExternalLogin(userName)) {
            userService.getExternalUserByLogin(userName)
        } else {
            val newUser = SecurityUtils.extractUser(attributes, authProvider, userName)
            userService.register(newUser)
            newUser
        }
    }


}
