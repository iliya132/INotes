package ru.iliya132.inotes.models

import ru.iliya132.inotes.models.base.BaseEntity
import java.io.Serializable
import javax.persistence.*

@Entity
@Table(name = "notebook_access")

@IdClass(NotebookAccessKey::class)
data class NotebookAccess(
    @Id
    @Column(name = "notebook_id")
    val notebookId: Long = 0L,
    @Id
    @Column(name = "user_id")
    val userId: Long = 0L
) : Serializable, BaseEntity<NotebookAccessKey> {
    override val id: NotebookAccessKey
        get() = NotebookAccessKey(notebookId, userId)
}
