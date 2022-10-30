package ru.iliya132.inotes.models

import org.hibernate.annotations.Type
import javax.persistence.*

@Entity
@Table(name = "blob")
class Blob(
    @Column(name = "file_name")
    val fileName: String = "",

    @Lob
    @Type(type = "org.hibernate.type.BinaryType")
    @Column(name = "data")
    val data: ByteArray = ByteArray(0),

    @Column(name = "user_id")
    val ownerId: Long = -1L,

    @Column(name = "size")
    val size: Long = -1L,

    @Column(name = "note_id")
    val noteId: Long = -1L,

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null
) {

    override fun equals(other: Any?): Boolean {
        if (this===other) return true
        if (javaClass!=other?.javaClass) return false

        other as Blob

        if (id!=other.id) return false
        if (fileName!=other.fileName) return false
        if (ownerId!=other.ownerId) return false
        if (size!=other.size) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + fileName.hashCode()
        result = 31 * result + ownerId.hashCode()
        result = 31 * result + size.hashCode()
        return result
    }
}
