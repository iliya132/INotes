package ru.iliya132.inotes.controller

import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import ru.iliya132.inotes.dto.NotebookDTO
import ru.iliya132.inotes.dto.NotebookWithNotesDTO
import ru.iliya132.inotes.models.Note
import ru.iliya132.inotes.services.NotebookService

@RestController
@RequestMapping("/api/notebook")
class NotebookController(
    private val notebookService: NotebookService
) {


    fun saveNotebook(notebook: NotebookDTO){
//        notebookService.save(notebook)
    }

    @GetMapping("/")
    fun getNotebooks(authentication: Authentication): List<NotebookWithNotesDTO> {
//        val currentUser = userManagerService.getUserInfo(authentication)
//        return notebookService.getNotebooksForUser(currentUser)
        return listOf()
    }

    @DeleteMapping("/remove/{id}")
    fun removeNotebook(@PathVariable id: Long, authentication: Authentication) :ResponseEntity<String>{
//        val currentUser = userManagerService.getUserInfo(authentication)
//        if(notebookService.isUserOwner(id, currentUser)){
//            notebookService.remove(id)
//            return ResponseEntity.ok().build()
//        }
        return ResponseEntity.badRequest().build()
    }

    @PostMapping("/add-note")
    fun addNote(note: Note){

    }

    @PutMapping("/update-note")
    fun updateNote(note:Note){

    }

    @DeleteMapping("/remove-note/{id}")
    fun removeNote(@PathVariable id:Long){

    }

    @GetMapping("/get-notes/{notebookId}")
    fun getNotes(@PathVariable notebookId: Long){

    }
}