package ru.iliya132.inotes.models

import ru.iliya132.inotes.models.base.BaseEntity
import java.io.Serializable
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.IdClass
import javax.persistence.Table

@Entity
@IdClass(TagKey::class)
@Table(name = "note_tags")
data class Tag(
    @Column(name = "note_id")
    @Id
    val noteId: Long = 0L,
    @Id
    val tag: String = ""
):Serializable, BaseEntity<TagKey> {
    override val id: TagKey
        get() = TagKey(noteId, tag)
}
