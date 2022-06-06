package ru.iliya132.inotes.models

import ru.iliya132.inotes.models.base.NamedEntity
import javax.persistence.*

@Entity
@Table(name = "roles")
class Role (
        @Id @GeneratedValue(strategy = GenerationType.AUTO) override val id: Long,
        override val name: String,
        @ManyToMany(mappedBy = "roles")
        val users: Collection<User>
):NamedEntity
