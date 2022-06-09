package ru.iliya132.inotes.models

import ru.iliya132.inotes.models.base.NamedEntity
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "notebooks")
data class Notebook(
    @Id
    override val id: Long = 0,
    override val name: String = "",
    val owner: Long = 0,
    val color: String = ""
) : NamedEntity, java.io.Serializable
