package ru.iliya132.inotes.repositories

import org.springframework.data.jpa.repository.JpaRepository
import ru.iliya132.inotes.models.NotebookAccess
import ru.iliya132.inotes.models.NotebookAccessKey

interface NotebookAccessRepository : JpaRepository<NotebookAccess, NotebookAccessKey> {

}