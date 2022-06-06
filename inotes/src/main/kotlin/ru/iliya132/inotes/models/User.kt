package ru.iliya132.inotes.models

import javax.persistence.*

@Entity
@Table(name = "users")
class User {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    var id: Long = 0
    lateinit var userName: String
    lateinit var password: String
    var enabled: Boolean = false
    @ManyToMany
    @JoinTable(
        name="user_roles",
        joinColumns = [JoinColumn(
            name = "user_id", referencedColumnName = "id")],
        inverseJoinColumns = [JoinColumn(
            name = "role_id", referencedColumnName = "id")]
    )
    lateinit var roles: Collection<Role>

    constructor(){}
    constructor(id: Long, userName: String, password: String, enabled: Boolean, roles: Collection<Role>) {
        this.id = id
        this.userName = userName
        this.password = password
        this.enabled = enabled
        this.roles = roles
    }
}