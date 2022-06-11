package ru.iliya132.inotes.models

import ru.iliya132.inotes.models.base.NamedEntity
import javax.persistence.*

@Entity
@Table(name = "roles")
data class Role(
		@Id @GeneratedValue(strategy = GenerationType.AUTO) override val id: Long = 0,
		override val name: String = "",
		@ManyToMany(mappedBy = "roles", fetch = FetchType.EAGER)
		val users: Collection<User>? = null
               ) : NamedEntity, java.io.Serializable
