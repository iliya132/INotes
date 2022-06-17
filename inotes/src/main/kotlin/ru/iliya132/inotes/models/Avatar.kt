package ru.iliya132.inotes.models

import org.hibernate.annotations.Type
import javax.persistence.*

@Entity
@Table(name = "avatars")
class Avatar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0

    @Lob
    @Type(type = "org.hibernate.type.BinaryType")
    var blob: ByteArray = ByteArray(0)

    @Column(name = "user_id")
    var userId: Long = 0

    constructor(id: Long, blob: ByteArray, userId: Long) {
        this.id = id
        this.blob = blob
        this.userId = userId
    }

    constructor()
}