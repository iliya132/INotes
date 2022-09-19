package ru.iliya132.inotes.models.base

interface NamedEntity :BaseEntity<Long>{
    val name: String
}