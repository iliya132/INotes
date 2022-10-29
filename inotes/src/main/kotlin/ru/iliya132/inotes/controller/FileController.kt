package ru.iliya132.inotes.controller

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import ru.iliya132.inotes.models.Blob
import ru.iliya132.inotes.models.User
import ru.iliya132.inotes.repositories.FileRepository
import ru.iliya132.inotes.services.security.UserService

@RestController
@RequestMapping("/api/file")
class FileController(
    private val fileRepository: FileRepository,
    private val userService: UserService
) {
    @Value("\${i-note.host-address}")
    val host: String? = null

    @PostMapping("/upload/{note_id}")
    fun uploadFile(@RequestParam("files") files: Array<MultipartFile>,
                   @PathVariable(name = "note_id") noteId: Long,
                   authentication: Authentication): ResponseEntity<Map<String, String>> {
        return try {
            val toSave = ArrayList<Blob>()
            val result = ArrayList<Blob>()
            files.map {
                if (fileRepository.existsByNoteIdAndFileName(noteId, it.originalFilename!!)) {
                    result.add(fileRepository.findByNoteIdAndFileName(noteId, it.originalFilename!!))
                    return@map
                }
                toSave.add(Blob(it.originalFilename!!, it.bytes, getUser(authentication).id, it.size, noteId))
            }
            result.addAll(fileRepository.saveAll(toSave))
            ResponseEntity.ok(
                result.associate { Pair(it.fileName, generateFileLink(it.id!!)) }
            )
        } catch (ex: Exception) {
            log.error("Exception occurred while saving file: ", ex)
            ResponseEntity.badRequest().build()
        }
    }

    @GetMapping("/download/{id}")
    @ResponseBody
    fun downloadFile(@PathVariable("id") id: Long,
                     auth: Authentication): ResponseEntity<ByteArray> {
        val file = fileRepository.findById(id)
        val user = getUser(auth)
        val isEmpty = file.isEmpty
        val isOwned = user.id==file.get().ownerId
        if (isEmpty || !isOwned) {
            var resp = StringBuilder()
            if (isEmpty) {
                resp.append("file was empty")
            }
            if (!isOwned) {
                resp.append("file is not user owned")
            }
            error(resp.toString())
        }
        val headers = HttpHeaders()
        headers.contentType = MediaType.APPLICATION_OCTET_STREAM
        headers.setContentDispositionFormData(file.get().fileName, file.get().fileName)
        headers.cacheControl = "must-revalidate, post-check=0, pre-check=0"
        return ResponseEntity(file.get().data, headers, HttpStatus.OK)
    }


    private fun getUser(authentication: Authentication): User {
        return userService.getUserFull(authentication)
    }

    private fun generateFileLink(id: Long): String {
        return "$host/api/file/download/$id"
    }

    companion object {
        val log: Logger = LoggerFactory.getLogger(FileController::class.java)
    }
}
