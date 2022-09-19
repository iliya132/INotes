package ru.iliya132.inotes.controller

import org.assertj.core.api.Assertions
import org.junit.After
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.security.test.context.support.WithUserDetails
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import ru.iliya132.inotes.config.SecurityConfig
import ru.iliya132.inotes.config.TestAuthConfig
import ru.iliya132.inotes.config.TestServicesConfig
import ru.iliya132.inotes.dto.NoteDTO
import ru.iliya132.inotes.dto.NotebookDTO
import ru.iliya132.inotes.services.NotebookService
import ru.iliya132.inotes.services.security.UserService
import ru.iliya132.inotes.utils.toDto

@RunWith(SpringRunner::class)
@WebMvcTest(NotebookController::class)
@Import(TestAuthConfig::class, SecurityConfig::class, TestServicesConfig::class)
class NoteBookControllerTest : BaseControllerTest() {

    @Autowired
    lateinit var mvcMock: MockMvc

    @Autowired
    lateinit var userService: UserService

    @Autowired
    lateinit var notebookService: NotebookService

    @After
    fun tearDown() {
        notebookService.remove(0)
        notebookService.removeNote(0)
    }

    @Test
    @WithUserDetails(defaultUserName)
    fun `can save notebook`() {
        val notebook = NotebookDTO(0, "can save notebook", "red", 0)

        mvcMock.perform(MockMvcRequestBuilders.post("$NOTEBOOK_API_URL/save")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(notebook)))
            .andExpect(status().isOk)

        val currentUser = userService.userRepository.findByUserName(defaultUserName)
        val notebooks = notebookService.getNotebooksForUser(currentUser!!.id)
        assert(notebooks.isNotEmpty())

        val firstNotebook = notebooks.first()
        val expectedResult = NotebookDTO(firstNotebook.id, firstNotebook.name, firstNotebook.color, currentUser.id)
        Assertions.assertThat(notebook).usingRecursiveComparison().isEqualTo(expectedResult)
    }

    @Test
    @WithUserDetails(defaultUserName)
    fun `can't save wrong notebook`() {
        val notebook = NotebookDTO(0, "", "", 0)

        mvcMock.perform(MockMvcRequestBuilders.post("$NOTEBOOK_API_URL/save")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(notebook)))
            .andExpect(status().isBadRequest)
            .andExpect { content().json("provided data is invalid") }
    }

    @Test
    fun `cant save notebook when not authenticated`() {
        val notebook = NotebookDTO(0, "can save notebook", "red", 0)

        mvcMock.perform(MockMvcRequestBuilders.post("$NOTEBOOK_API_URL/save")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(notebook)))
            .andExpect(status().isForbidden)
    }

    @Test
    @WithUserDetails(defaultUserName)
    fun `can get notebooks`() {
        val notebook = NotebookDTO(0, "can get notebooks", "red", 0)
        notebookService.save(notebook)

        mvcMock.perform(MockMvcRequestBuilders.get("$NOTEBOOK_API_URL/"))
            .andExpect(status().isOk)
            .andExpect(content().json("[{\"id\":0,\"name\":\"can get notebooks\",\"color\":\"red\",\"notes\":[]}]"))
    }

    @Test
    fun `can't get notebooks when not authenticated`() {
        val notebook = NotebookDTO(0, "can get notebooks", "red", 0)
        notebookService.save(notebook)

        mvcMock.perform(MockMvcRequestBuilders.get("$NOTEBOOK_API_URL/"))
            .andExpect(status().isForbidden)
    }

    @Test
    @WithUserDetails(defaultUserName)
    fun `can remove notebook`() {
        val notebook = NotebookDTO(0, "can get notebooks", "red", 0)
        notebookService.save(notebook)

        mvcMock.perform(MockMvcRequestBuilders.delete("$NOTEBOOK_API_URL/remove/0"))
            .andExpect(status().isOk)

        val result = notebookService.getNotebooksForUser(0)
        assert(result.isEmpty())
    }

    @Test
    fun `can't remove notebook when not authenticated`() {
        val notebook = NotebookDTO(0, "can get notebooks", "red", 0)
        notebookService.save(notebook)

        mvcMock.perform(MockMvcRequestBuilders.delete("$NOTEBOOK_API_URL/remove/0"))
            .andExpect(status().isForbidden)

        val result = notebookService.getNotebooksForUser(0)
        assert(result.isNotEmpty())
    }

    @Test
    @WithUserDetails(defaultUserName)
    fun `can add note`() {
        val note = NoteDTO(0, "can add note", "any content goes here", 0L, false, "123", arrayListOf())
        val notebook = NotebookDTO(0, "can add note", "red", 0)
        notebookService.save(notebook)

        mvcMock.perform(MockMvcRequestBuilders.post("$NOTEBOOK_API_URL/add-note")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(note)))
            .andExpect(status().isOk)
    }

    @Test
    fun `can't add note when not authenticated`() {
        val note = NoteDTO(0, "can add note", "any content goes here", 0L, false, "123", arrayListOf())

        mvcMock.perform(MockMvcRequestBuilders.post("$NOTEBOOK_API_URL/add-note")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(note)))
            .andExpect(status().isForbidden)
    }

    @Test
    @WithUserDetails(defaultUserName)
    fun `can't add wrong note`() {
        val note = NoteDTO(0, "", "", 0L, false, "123", arrayListOf())
        val notebook = NotebookDTO(0, "can add note", "red", 0)
        notebookService.save(notebook)

        mvcMock.perform(MockMvcRequestBuilders.post("$NOTEBOOK_API_URL/add-note")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(note)))
            .andExpect(status().isBadRequest)
    }

    @Test
    @WithUserDetails(defaultUserName)
    fun `can remove note`() {
        val note = NoteDTO(0, "can add note", "any content goes here", 0L, false, "123", arrayListOf())
        val notebook = NotebookDTO(0, "can add note", "red", 0)
        notebookService.save(notebook)
        notebookService.saveNote(note)

        mvcMock.perform(MockMvcRequestBuilders.delete("$NOTEBOOK_API_URL/remove-note/0"))
            .andExpect(status().isOk)

        val result = notebookService.getNotes(0)
        assert(result.isEmpty())
    }

    @Test
    fun `can't remove note when not authenticated`() {
        val note = NoteDTO(0, "can add note", "any content goes here", 0L, false, "123", arrayListOf())
        notebookService.saveNote(note)

        mvcMock.perform(MockMvcRequestBuilders.delete("$NOTEBOOK_API_URL/remove-note/0"))
            .andExpect(status().isForbidden)

        val result = notebookService.getNotes(0)
        assert(result.isNotEmpty())

    }

    @Test
    @WithUserDetails(defaultUserName)
    fun `can get notes`() {
        val note = NoteDTO(0, "can add note", "any content goes here", 0L, false, "123", arrayListOf())
        val notebook = NotebookDTO(0, "can add note", "red", 0)
        notebookService.save(notebook)
        notebookService.saveNote(note)

        mvcMock.perform(MockMvcRequestBuilders.get("$NOTEBOOK_API_URL/get-notes/0"))
            .andExpect(status().isOk)
            .andExpect(content().json("[{\"id\":0,\"name\":\"can add note\",\"content\":\"any content goes here\",\"notebookId\":0}]"))
    }

    @Test
    fun `can't get notes when not authenticated`() {
        val note = NoteDTO(0, "can add note", "any content goes here", 0L, false, "123", arrayListOf())
        notebookService.saveNote(note)

        mvcMock.perform(MockMvcRequestBuilders.get("$NOTEBOOK_API_URL/get-notes/0"))
            .andExpect(status().isForbidden)
    }

    @Test
    @WithUserDetails(defaultUserName)
    fun `can get user tags`() {
        mvcMock.perform(MockMvcRequestBuilders.get("$NOTEBOOK_API_URL/tags"))
            .andExpect(status().isOk)
    }

    @Test
    fun `can't get user tags when not authenticated`() {
        mvcMock.perform(MockMvcRequestBuilders.get("$NOTEBOOK_API_URL/tags"))
            .andExpect(status().isForbidden)
    }

    @Test
    @WithUserDetails(defaultUserName)
    fun `can update tags`() {
        val note = NoteDTO(0, "can add note", "any content goes here", 0L, false, "123", arrayListOf())
        val saved = notebookService.saveNote(note)

        val noteToUpdate = saved.toDto()
        noteToUpdate.tags.addAll(listOf("tag1", "tag2"))

        mvcMock.perform(MockMvcRequestBuilders.post("$NOTEBOOK_API_URL/update-tags")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(noteToUpdate)))
            .andExpect(status().isOk)

        val notes = notebookService.getNotes(noteToUpdate.notebookId)
        Assertions.assertThat(notes).hasSize(1)
        Assertions.assertThat(notes.first().tags).hasSize(2)
    }

    @Test
    fun `can't update tags when not authenticated`() {
        val note = NoteDTO(0, "can add note", "any content goes here", 0L, false, "123", arrayListOf())
        val saved = notebookService.saveNote(note)

        val noteToUpdate = saved.toDto()
        noteToUpdate.tags.addAll(listOf("tag1", "tag2"))

        mvcMock.perform(MockMvcRequestBuilders.post("$NOTEBOOK_API_URL/update-tags")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(noteToUpdate)))
            .andExpect(status().isForbidden)
    }
}
