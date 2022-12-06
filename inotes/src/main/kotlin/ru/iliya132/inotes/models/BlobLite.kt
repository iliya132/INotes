package ru.iliya132.inotes.models

interface BlobLite {
    fun getId(): Long
    fun getFileName(): String
    fun getNoteId(): Long
    fun getSize(): Long
    fun userId(): Long
}
