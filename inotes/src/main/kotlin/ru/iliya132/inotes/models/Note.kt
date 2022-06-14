package ru.iliya132.inotes.models

import ru.iliya132.inotes.models.base.NamedEntity
import javax.persistence.*

@Entity
@Table(name = "notes")
data class Note(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    override val id: Long = 0L,
    override val name: String = "",
    val notebook: Long = 0L,
    val content: String = ""
) : NamedEntity, java.io.Serializable
