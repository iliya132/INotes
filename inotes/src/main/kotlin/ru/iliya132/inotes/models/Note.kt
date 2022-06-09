package ru.iliya132.inotes.models

import ru.iliya132.inotes.models.base.NamedEntity
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "notes")
data class Note(
    @Id
    override val id: Long = 0L,
    override val name: String = "",
    val notebook: Long = 0L,
    val content: String = ""
) : NamedEntity, java.io.Serializable
