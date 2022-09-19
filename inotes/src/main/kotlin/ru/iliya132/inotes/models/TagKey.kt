package ru.iliya132.inotes.models

import java.io.Serializable

data class TagKey(
    val noteId: Long = 0L,
    val tag: String = ""
):Serializable
