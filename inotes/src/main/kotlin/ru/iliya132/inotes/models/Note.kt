package ru.iliya132.inotes.models

import ru.iliya132.inotes.models.base.NamedEntity
import javax.persistence.*

@Entity
@Table(name = "notes")
data class Note(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    override var id: Long = 0L,
    override var name: String = "",
    var notebook: Long = 0L,
    var content: String = "",
    @Column(name = "is_public_url_shared")
    var isPublicUrlShared: Boolean = false,
    @Column(name = "public_id")
    var publicId: String? = null
) : NamedEntity, java.io.Serializable
