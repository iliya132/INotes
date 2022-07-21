package ru.iliya132.inotes.services.security

import ru.iliya132.inotes.models.User

class SecurityUtils {
    companion object {
        fun extractUser(oauthAttributes: Map<String, Any>, authProvider: String, userName: String): User {
            val newUser = User()
            newUser.externalUserName = "${authProvider}_${userName}"
            newUser.userName = oauthAttributes["id"] as String
            newUser.displayName = oauthAttributes["display_name"] as String? ?: oauthAttributes["login"] as String?
            newUser.externalId = oauthAttributes["id"] as String?
            newUser.externalLogin = oauthAttributes["login"] as String?
            newUser.externalDefaultEmail = oauthAttributes["default_email"] as String?
            newUser.externalIsAvatarEmpty = oauthAttributes["is_avatar_empty"] as Boolean?
            newUser.externalPsuid = oauthAttributes["psuid"] as String?
            return newUser
        }
    }
}