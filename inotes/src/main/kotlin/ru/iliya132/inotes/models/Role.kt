package ru.iliya132.inotes.models

import ru.iliya132.inotes.models.base.NamedEntity
import javax.persistence.*

@Entity
@Table(name = "roles")
class Role(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    override var id: Long = 0,
    override var name: String = "",
    @ManyToMany(mappedBy = "roles", fetch = FetchType.EAGER)
    var users: Collection<User>? = null
) : NamedEntity, java.io.Serializable
