package ru.iliya132.inotes.models

import ru.iliya132.inotes.models.base.NamedEntity
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "notes")
data class Note(
    @Id
    override val id: Long,
    override val name: String,
    val notebook: Long,
    val content: String
) : NamedEntity
