package ru.iliya132.inotes.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.iliya132.inotes.repositories.ImageRepository

@RestController
@RequestMapping("/api/static")
class StaticController {
    @Autowired
    lateinit var imageRepository: ImageRepository

    @GetMapping("/img/{id}",
        produces = [MediaType.APPLICATION_OCTET_STREAM_VALUE,
            MediaType.IMAGE_JPEG_VALUE,
            MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_GIF_VALUE])
    fun getImage(@PathVariable id: Long): ByteArray {
        val avatar = imageRepository.findById(id).orElse(null) ?: return ByteArray(0)
        return avatar.blob
    }
}
