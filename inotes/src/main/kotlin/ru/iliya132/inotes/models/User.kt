package ru.iliya132.inotes.models

import org.hibernate.annotations.Type
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.oauth2.core.oidc.OidcIdToken
import org.springframework.security.oauth2.core.oidc.OidcUserInfo
import org.springframework.security.oauth2.core.oidc.user.OidcUser
import org.springframework.security.oauth2.core.user.OAuth2User
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "users")
class User : UserDetails, java.io.Serializable, OAuth2User, OidcUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0
    var userName: String = ""
    private var password: String = ""
    var enabled: Boolean = true

    @Column(name = "external_user_name")
    var externalUserName: String? = null

    @Column(name = "external_id")
    var externalId: String? = null

    @Column(name = "external_login")
    var externalLogin: String? = null

    @Column(name = "external_default_email")
    var externalDefaultEmail: String = ""

    @Column(name = "external_is_avatar_empty")
    var externalIsAvatarEmpty: Boolean? = null

    @Column(name = "external_psuid")
    var externalPsuid: String? = null

    @Column(name = "token")
    var tokenValue: String? = null

    @Column(name = "display_name")
    var displayName: String? = null

    @Column(name = "verification_code")
    var verificationCode: String? = null

    @Column(name = "verification_type", columnDefinition = "verification_type")
    @Enumerated(EnumType.STRING)
    var verificationType: VerificationType? = null

    @Column(name = "verification_code_expire_at")
    var verificationCodeExpireAt: LocalDateTime? = null

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = [JoinColumn(
            name = "user_id", referencedColumnName = "id"
        )],
        inverseJoinColumns = [JoinColumn(
            name = "role_id", referencedColumnName = "id"
        )]
    )
    var roles: Collection<Role> = listOf()

    constructor()

    constructor(id: Long, userName: String, password: String, enabled: Boolean, roles: Collection<Role>, externalUserName: String?) {

        this.id = id
        this.userName = userName
        this.password = password
        this.enabled = enabled
        this.roles = roles
        this.externalUserName = externalUserName
    }

    override fun getName(): String {
        return if (externalUserName!=null) {
            externalUserName!!
        } else {
            userName
        }
    }

    override fun getAttributes(): MutableMap<String, Any> {
        val attributes = mutableMapOf<String, Any>()
        putIfNotNull(attributes, "id", externalId)
        putIfNotNull(attributes, "login", externalLogin)
        putIfNotNull(attributes, "default_email", externalDefaultEmail)
        putIfNotNull(attributes, "is_avatar_empty", externalIsAvatarEmpty)
        putIfNotNull(attributes, "psuid", externalPsuid)
        return attributes
    }

    private fun <Key, Value> putIfNotNull(map: MutableMap<Key, Value>, key: Key, value: Value?) {
        if (value!=null) {
            map[key] = value
        }
    }

    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return roles.map { SimpleGrantedAuthority(it.name) }.toMutableList()
    }

    override fun getClaims(): MutableMap<String, Any> {
        val claims = mutableMapOf<String, Any>()
        claims.putAll(userInfo.claims)
        claims.putAll(idToken.claims)
        return claims
    }

    override fun getUserInfo(): OidcUserInfo {
        return OidcUserInfo
            .builder()
            .email(userName)
            .nickname(userName)
            .build()
    }

    override fun getIdToken(): OidcIdToken {
        return OidcIdToken.withTokenValue(tokenValue).build()
    }

    override fun getPassword(): String {
        return password
    }

    fun setPassword(password: String) {
        this.password = password
    }

    override fun getUsername(): String {
        return userName
    }

    override fun isAccountNonExpired(): Boolean {
        return true
    }

    override fun isAccountNonLocked(): Boolean {
        return true
    }

    override fun isCredentialsNonExpired(): Boolean {
        return true
    }

    override fun isEnabled(): Boolean {
        return enabled
    }

}
