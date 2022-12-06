package ru.iliya132.inotes.models

import java.io.Serializable

data class NotebookAccessKey(
    val notebookId: Long,
    val userId: Long
) : Serializable
