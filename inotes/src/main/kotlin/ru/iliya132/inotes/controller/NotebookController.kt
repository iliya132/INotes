package ru.iliya132.inotes.controller

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import ru.iliya132.inotes.dto.NoteDTO
import ru.iliya132.inotes.dto.NotebookDTO
import ru.iliya132.inotes.dto.NotebookWithNotesDTO
import ru.iliya132.inotes.models.User
import ru.iliya132.inotes.services.NotebookService
import ru.iliya132.inotes.services.security.UserService
import ru.iliya132.inotes.utils.toDTO
import ru.iliya132.inotes.utils.toDto
import ru.iliya132.inotes.utils.validation.CustomValidationException
import java.util.*

@RestController
@RequestMapping("/api/notebook")
class NotebookController(private val notebookService: NotebookService) {
    @Autowired
    lateinit var userService: UserService

    @PostMapping("/save")
    fun saveNotebook(@RequestBody notebook: NotebookDTO, authentication: Authentication): ResponseEntity<NotebookDTO> {
        if (!notebook.validate()) {
            throw CustomValidationException("provided data is invalid")
        }
        val currentUser = getUser(authentication)
        return ResponseEntity.ok().body(notebookService.save(notebook.copy(owner = currentUser.id)).toDTO())
    }

    @GetMapping("/")
    fun getNotebooks(authentication: Authentication): List<NotebookWithNotesDTO> {
        val currentUser = getUser(authentication)
        return notebookService.getNotebooksForUser(currentUser.id)
    }

    @GetMapping("/tags")
    fun getUserTags(authentication: Authentication): List<String> {
        val currentUser = getUser(authentication)
        return notebookService.getUserTags(currentUser.id)
    }

    @DeleteMapping("/remove/{id}")
    fun removeNotebook(@PathVariable id: Long, authentication: Authentication): ResponseEntity<String> {
        return isUserOwnedOrBadRequest(id, authentication) {
            notebookService.remove(id)
            ResponseEntity.ok("")
        }
    }

    @PostMapping("/add-note")
    fun addNote(@RequestBody note: NoteDTO, authentication: Authentication): ResponseEntity<NoteDTO> {
        if (!note.validate()) {
            throw CustomValidationException("provided note is not valid")
        }
        return isUserOwnedOrBadRequest(note.notebookId, authentication) {
            return@isUserOwnedOrBadRequest ResponseEntity.ok().body(notebookService.addNote(note).toDto())
        }
    }

    @PutMapping("/update-note")
    fun updateNote(@RequestBody note: NoteDTO, authentication: Authentication): ResponseEntity<String> {
        if (!note.validate()) {
            throw CustomValidationException("provided note is not valid")
        }
        return isUserOwnedOrBadRequest(note.notebookId, authentication) {
            notebookService.saveNote(note)
            ResponseEntity.ok("")
        }
    }

    @DeleteMapping("/remove-note/{id}")
    fun removeNote(@PathVariable id: Long, authentication: Authentication): ResponseEntity<String> {
        val note = notebookService.findNoteById(id)
        if (note.isPresent) {
            return isUserOwnedOrBadRequest(note.get().notebook, authentication) {
                notebookService.removeNote(id)
                ResponseEntity.ok("")
            }
        }
        return ResponseEntity.badRequest().body("No notes found for $id")
    }

    @GetMapping("/get-notes/{notebookId}")
    fun getNotes(
        @PathVariable notebookId: Long,
        authentication: Authentication
    ): ResponseEntity<Collection<NoteDTO>> {
        return isUserOwnedOrBadRequestWithEntity(notebookId, authentication) {
            return@isUserOwnedOrBadRequestWithEntity notebookService.getNotes(notebookId)
        }
    }

    @PostMapping("/share-note/{noteId}/{isEnabled}")
    fun shareNote(@PathVariable noteId: Long, @PathVariable isEnabled: Boolean, auth: Authentication): ResponseEntity<String?> {
        val notebookId = notebookService.findNoteById(noteId)
        if (!notebookId.isPresent) {
            return ResponseEntity.notFound().build()
        }

        return isUserOwnedOrBadRequest(notebookId.get().notebook, auth) {
            ResponseEntity.ok(notebookService.sharePublicUrl(noteId, isEnabled))
        }
    }

    @GetMapping("/shared-note/{noteUrl}")
    fun getSharedNote(@PathVariable noteUrl: String): ResponseEntity<String> {
        val sharedNote = notebookService.getShared(noteUrl)
        if (sharedNote==null || !sharedNote.isPublicUrlShared) {
            return ResponseEntity.notFound().build()
        }
        return ResponseEntity.ok(sharedNote.content)
    }

    @PostMapping("/update-tags")
    fun updateTags(@RequestBody note: NoteDTO): ResponseEntity<NoteDTO> {
        return try {
            notebookService.updateTags(note.id, note.tags)
            ResponseEntity.ok().build()
        } catch (e: Exception) {
            log.error(e.message)
            ResponseEntity.badRequest().build()
        }
    }

    private fun <T> isUserOwnedOrBadRequest(
        notebookId: Long,
        auth: Authentication,
        action: () -> ResponseEntity<T>
    ): ResponseEntity<T> {
        val currentUser = getUser(auth)

        return if (notebookService.isUserOwner(notebookId, currentUser.id)) {
            action()
        } else {
            throw BadCredentialsException("Notebook doesn't belong to current user authenticated")
        }
    }

    private fun isUserOwnedOrBadRequestUnit(
        notebookId: Long,
        auth: Authentication,
        action: () -> Unit
    ): ResponseEntity<String> {
        val currentUser = getUser(auth)
        return if (notebookService.isUserOwner(notebookId, currentUser.id)) {
            action()
            ResponseEntity.ok().build()
        } else {
            throw BadCredentialsException("Notebook doesn't belong to current user authenticated")
        }
    }

    private fun <T : Any> isUserOwnedOrBadRequestWithEntity(
        notebookId: Long,
        auth: Authentication,
        action: () -> T
    ): ResponseEntity<T> {
        val currentUser = getUser(auth)
        return if (notebookService.isUserOwner(notebookId, currentUser.id)) {
            return ResponseEntity.of(Optional.of(action()))
        } else {
            ResponseEntity.badRequest().build()
        }
    }

    private fun getUser(authentication: Authentication): User {
        return userService.getUserFull(authentication)
    }

    companion object{
        val log = LoggerFactory.getLogger(NotebookController::class.java)
    }
}
