package ru.iliya132.inotes.models

interface BlobLite {
    fun getId(): Long
    fun getFileName(): String
    fun getSize(): Long
}
