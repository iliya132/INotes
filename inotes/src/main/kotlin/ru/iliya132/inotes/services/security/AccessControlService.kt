package ru.iliya132.inotes.services.security

import ru.iliya132.inotes.models.NotebookAccessKey
import ru.iliya132.inotes.models.exceptions.ForbiddenException
import ru.iliya132.inotes.repositories.FileRepository
import ru.iliya132.inotes.repositories.NotebookAccessRepository
import ru.iliya132.inotes.repositories.NotebookRepository
import ru.iliya132.inotes.utils.AuthUtils

class AccessControlService(
    private val notebookRepository: NotebookRepository,
    private val notebookAccessRepository: NotebookAccessRepository,
    private val fileRepository: FileRepository,
    private val authUtils: AuthUtils
) {
    fun validateUserHasAccessToNotebook(notebookId: Long) {
        val user = authUtils.getCurrentUserId()
        val hasAccess = notebookAccessRepository.existsById(NotebookAccessKey(notebookId, user))
        if (!hasAccess) {
            throwForbidden(user)
        }
    }

    fun validateUserHasAccessToNote(noteId: Long) {
        val userId = authUtils.getCurrentUserId()
        val isUserOwned = notebookRepository.isUserOwnerByNoteId(noteId, userId)
        if (isUserOwned) {
            return
        }
        throwForbidden(userId)
    }

    fun validateUserHasAccessToFile(fileId: Long) {
        // TODO optimize this to use 1 query
        val fileInfo = fileRepository.findByIdLight(fileId)
        validateUserHasAccessToNote(fileInfo.getNoteId())
    }

    private fun throwForbidden(userId: Long) {
        throw ForbiddenException("Access denied for user $userId")
    }
}