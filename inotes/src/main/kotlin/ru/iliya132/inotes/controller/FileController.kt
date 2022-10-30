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
import org.springframework.web.server.ResponseStatusException
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

    @Value("\${i-note.file.max_upload_size}")
    private val maxSingleFileSize: Long = 0L

    @Value("\${i-note.file.max_overall_file_size_per_user}")
    private val maxOverallFilesSizePerUser: Long = 0L

    @PostMapping("/upload/{note_id}")
    fun uploadFile(
        @RequestParam("files") files: Array<MultipartFile>,
        @PathVariable(name = "note_id") noteId: Long,
        authentication: Authentication
    ): ResponseEntity<Map<String, String>> {
        return try {
            val toSave = ArrayList<Blob>()
            val result = ArrayList<Blob>()
            val user = getUser(authentication)
            files.map {
                validateFileSize(it, user.id)
                if (fileRepository.existsByNoteIdAndFileName(noteId, it.originalFilename!!)) {
                    result.add(fileRepository.findByNoteIdAndFileName(noteId, it.originalFilename!!))
                    return@map
                }
                toSave.add(Blob(it.originalFilename!!, it.bytes, user.id, it.size, noteId))
            }
            validateOverallFileSize(user.id, *toSave.toTypedArray())
            result.addAll(fileRepository.saveAll(toSave))
            ResponseEntity.ok(
                result.associate { Pair(it.fileName, generateFileLink(it.id!!)) }
            )
        } catch (ex: Exception) {
            log.error("Exception occurred while saving file: ", ex)
            ResponseEntity.badRequest().build()
        }
    }

    private fun validateFileSize(file: MultipartFile, id: Long) {
        if (file.size > maxSingleFileSize) {
            log.error(
                "user with id {} attempted to upload file with size {}, which exceeded max file size of {}",
                id,
                file.size,
                maxSingleFileSize
            )
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Max file size exceeded")
        }
    }

    private fun validateOverallFileSize(userId: Long, vararg files: Blob) {
        val currentFileSizeSum = fileRepository.sumSizeByUserId(userId) ?: 0L
        val newFilesSize = files.sumOf { it.size }
        if (currentFileSizeSum + newFilesSize > maxOverallFilesSizePerUser) {
            log.error(
                "user {} attempted to upload files with size {}, but overall taken size was {}/{}",
                userId,
                newFilesSize,
                currentFileSizeSum,
                maxOverallFilesSizePerUser
            )
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Max overall file size per user exceeded")
        }
    }

    @GetMapping("/download/{id}")
    @ResponseStatus()
    @ResponseBody
    fun downloadFile(
        @PathVariable("id") id: Long,
        auth: Authentication
    ): ResponseEntity<ByteArray> {
        val file = fileRepository.findById(id)
        val user = getUser(auth)
        val isEmpty = file.isEmpty
        val isOwned = user.id == file.get().ownerId
        if (isEmpty || !isOwned) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Nothing found for requested resource")
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
