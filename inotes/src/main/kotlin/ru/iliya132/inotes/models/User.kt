package ru.iliya132.inotes.models

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import javax.persistence.*

@Entity
@Table(name = "users")
class User : UserDetails, java.io.Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0
    var userName: String = ""
    private var password: String = ""
    var enabled: Boolean = true

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

    constructor(id: Long, userName: String, password: String, enabled: Boolean, roles: Collection<Role>) {
        this.id = id
        this.userName = userName
        this.password = password
        this.enabled = enabled
        this.roles = roles
    }

    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return roles.map { SimpleGrantedAuthority(it.name) }.toMutableList()
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
