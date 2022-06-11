package ru.iliya132.inotes.controller

import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import ru.iliya132.inotes.dto.NoteDTO
import ru.iliya132.inotes.dto.NotebookDTO
import ru.iliya132.inotes.dto.NotebookWithNotesDTO
import ru.iliya132.inotes.models.User
import ru.iliya132.inotes.services.NotebookService
import ru.iliya132.inotes.utils.validation.CustomValidationException
import java.util.*

@RestController
@RequestMapping("/api/notebook")
class NotebookController(private val notebookService: NotebookService) {

    @PostMapping("/save")
    fun saveNotebook(@RequestBody notebook: NotebookDTO, authentication: Authentication): ResponseEntity<String> {
        if (!notebook.validate()) {
            throw CustomValidationException("provided data is invalid")
        }
        notebookService.save(notebook)
        return ResponseEntity.ok().build()
    }

    @GetMapping("/")
    fun getNotebooks(authentication: Authentication): List<NotebookWithNotesDTO> {
        val currentUser = authentication.principal as User
        return notebookService.getNotebooksForUser(currentUser.id)
    }

    @DeleteMapping("/remove/{id}")
    fun removeNotebook(@PathVariable id: Long, authentication: Authentication): ResponseEntity<String> {
        return isUserOwnedOrBadRequest(id, authentication) {
            notebookService.remove(id)
        }
    }

    @PostMapping("/add-note")
    fun addNote(@RequestBody note: NoteDTO, authentication: Authentication): ResponseEntity<String> {
        if (!note.validate()) {
            throw CustomValidationException("provided note is not valid")
        }
        return isUserOwnedOrBadRequest(note.notebookId, authentication) {
            notebookService.saveNote(note)
        }
    }

    @PutMapping("/update-note")
    fun updateNote(@RequestBody note: NoteDTO, authentication: Authentication): ResponseEntity<String> {
        if (!note.validate()) {
            throw CustomValidationException("provided note is not valid")
        }
        return isUserOwnedOrBadRequest(note.notebookId, authentication) {
            notebookService.saveNote(note)
        }
    }

    @DeleteMapping("/remove-note/{id}")
    fun removeNote(@PathVariable id: Long, authentication: Authentication): ResponseEntity<String> {
        val note = notebookService.findNoteById(id)
        if (note.isPresent) {
            return isUserOwnedOrBadRequest(note.get().notebook, authentication) {
                notebookService.removeNote(id)
            }
        }
        return ResponseEntity.badRequest().body("No notes found for $id")
    }

    @GetMapping("/get-notes/{notebookId}")
    fun getNotes(
        @PathVariable notebookId: Long,
        authentication: Authentication
    ): ResponseEntity<kotlin.collections.Collection<NoteDTO>> {
        return isUserOwnedOrBadRequestWithEntity(notebookId, authentication) {
            return@isUserOwnedOrBadRequestWithEntity notebookService.getNotes(notebookId)
        }
    }

    private fun isUserOwnedOrBadRequest(
        notebookId: Long,
        auth: Authentication,
        action: () -> Unit
    ): ResponseEntity<String> {
        val currentUser = auth.principal as User
        return if (notebookService.isUserOwner(notebookId, currentUser.id)) {
            action()
            ResponseEntity.ok().build()
        } else {
            ResponseEntity.badRequest().body("Notebook doesn't belong to current user authenticated")
        }
    }

    private fun <T : Any> isUserOwnedOrBadRequestWithEntity(
        notebookId: Long,
        auth: Authentication,
        action: () -> T
    ): ResponseEntity<T> {
        val currentUser = auth.principal as User
        return if (notebookService.isUserOwner(notebookId, currentUser.id)) {
            return ResponseEntity.of(Optional.of(action()))
        } else {
            ResponseEntity.badRequest().build()
        }
    }
}
