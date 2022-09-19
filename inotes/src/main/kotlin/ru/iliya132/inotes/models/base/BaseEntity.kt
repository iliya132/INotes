package ru.iliya132.inotes.models.base

interface BaseEntity<TKey> {
    val id: TKey
}