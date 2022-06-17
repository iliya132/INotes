package ru.iliya132.inotes.models

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import javax.persistence.*

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    private val userName: String = "",
    private val password: String = "",
    private val enabled: Boolean = true,

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
    private val roles: Collection<Role> = listOf()
) : UserDetails, java.io.Serializable {

    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return roles.map { SimpleGrantedAuthority(it.name) }.toMutableList()
    }

    override fun getPassword(): String {
        return password
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

    override fun equals(other: Any?): Boolean {
        if (this===other) return true
        if (javaClass!=other?.javaClass) return false

        other as User

        if (id!=other.id) return false
        if (userName!=other.userName) return false
        if (password!=other.password) return false
        if (enabled!=other.enabled) return false
        if (roles!=other.roles) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + userName.hashCode()
        result = 31 * result + password.hashCode()
        result = 31 * result + enabled.hashCode()
        result = 31 * result + roles.hashCode()
        return result
    }
}
