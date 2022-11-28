package ru.iliya132.inotes.controller

import org.assertj.core.api.Assertions
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.mock.web.MockMultipartFile
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.context.web.WebAppConfiguration
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.setup.DefaultMockMvcBuilder
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.context.WebApplicationContext
import ru.iliya132.inotes.config.SecurityConfig
import ru.iliya132.inotes.config.ServicesConfig
import ru.iliya132.inotes.dto.NoteDTO
import ru.iliya132.inotes.dto.NotebookDTO
import ru.iliya132.inotes.models.*
import ru.iliya132.inotes.repositories.FileRepository
import ru.iliya132.inotes.repositories.RolesRepository
import ru.iliya132.inotes.repositories.UserRepository
import ru.iliya132.inotes.services.NotebookService
import javax.transaction.Transactional

@ExtendWith(SpringExtension::class)
@Transactional
@SpringBootTest
@WebAppConfiguration
@AutoConfigureMockMvc
@Import(SecurityConfig::class, ServicesConfig::class, FileController::class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class FileControllerTest : BaseControllerTestWithDb() {

    @Autowired
    private lateinit var wac: WebApplicationContext

    lateinit var mvcMock: MockMvc

    @Autowired
    lateinit var notebookService: NotebookService

    @Autowired
    private lateinit var userRepository: UserRepository

    @Autowired
    private lateinit var rolesRepository: RolesRepository

    @Autowired
    private lateinit var fileRepository: FileRepository

    private lateinit var notebook: Notebook
    private lateinit var note: Note
    private lateinit var user: User
    private lateinit var secondUser: User

    @BeforeAll
    fun onSetUp() {
        mvcMock = MockMvcBuilders.webAppContextSetup(wac)
            .apply<DefaultMockMvcBuilder>(springSecurity())
            .build()
        val defaultRole = rolesRepository.findByName("ROLE_USER").first()
        rolesRepository.save(defaultRole)
        val defaultUser = User(
            0, defaultUserName, BCryptPasswordEncoder().encode(defaultUserPassword),
            true, listOf(defaultRole), "externalUserName")
        val secondUser = User(
                0, secondUserName, BCryptPasswordEncoder().encode(defaultUserPassword),
        true, listOf(defaultRole), "externalUserName"
        )

        user = userRepository.save(defaultUser)
        this.secondUser = userRepository.save(secondUser)
        notebook = notebookService.save(NotebookDTO(TEST_NOTEBOOK_ID, "test_notebook", "red", user.id))
        note = notebookService.saveNote(
            NoteDTO(
                 TEST_NOTE_ID,
                "test_note",
                "## test_note ",
                notebook.id,
                false,
                null,
                arrayListOf()
            )
        )
    }

    @Test
    @WithMockUser(defaultUserName)
    fun `can upload file`() {
        val file = generateFile(100, "test1")
        val file2 = generateFile(150, "test2")
        val res = uploadFile(note.id, file, file2)
            .andExpect { Assertions.assertThat(it.response.status).isEqualTo(200) }
            .andReturn()
        Assertions.assertThat(res.response.errorMessage).isNull()

        val savedBlobs = fileRepository.findAll()
        Assertions.assertThat(savedBlobs).hasSize(2)
    }

    @Test
    @WithMockUser(defaultUserName)
    fun `can download file`() {
        val byteArray = ByteArray(100)
        byteArray[0] = 1
        byteArray[1] = 1
        val blob = Blob("test", ByteArray(100), user.id, 100, note.id)
        val actualBlob = fileRepository.save(blob)

        val result: ByteArray = downloadFile(actualBlob.id!!)
            .andExpect { Assertions.assertThat(it.response.status).isEqualTo(200) }
            .andReturn()
            .response.contentAsByteArray
        Assertions.assertThat(result).isEqualTo(actualBlob.data)
    }

    @Test
    fun `cant download when not signied in`() {
        val byteArray = ByteArray(100)
        byteArray[0] = 1
        byteArray[1] = 1
        val blob = Blob("test", ByteArray(100), user.id, 100, note.id)
        val actualBlob = fileRepository.save(blob)

        downloadFile(actualBlob.id!!)
            .andExpect { Assertions.assertThat(it.response.status).isEqualTo(403) }
    }

    @Test
    fun `cant upload when not signed in`() {
        val file = generateFile(100, "test1")
        val file2 = generateFile(150, "test2")
        uploadFile(note.id, file, file2)
            .andExpect { Assertions.assertThat(it.response.status).isEqualTo(403) }

        val savedBlobs = fileRepository.findAll()
        Assertions.assertThat(savedBlobs).hasSize(0)
    }

    @Test
    @WithMockUser(defaultUserName)
    fun `cant upload greater then limit`() {
        val file = generateFile(100 * 1024 * 1024, "test1")
        val file2 = generateFile(150 * 1024 * 1024, "test2")
        uploadFile(note.id, file, file2)
            .andExpect { Assertions.assertThat(it.response.status).isEqualTo(400) }

        val savedBlobs = fileRepository.findAll()
        Assertions.assertThat(savedBlobs).hasSize(0)
    }

    @Test
    @WithMockUser(defaultUserName)
    fun `cant upload more then max total size limit`() {
        val files = ArrayList<MockMultipartFile>(10)
        for (i in 1..20) {
            files.add(generateFile(9 * 1024 * 1024, "test_$i"))
        }
        uploadFile(note.id, *files.toTypedArray())
            .andExpect { Assertions.assertThat(it.response.status).isEqualTo(400) }
    }

    @Test
    @WithMockUser(defaultUserName)
    fun `when uploading same file should return link to old`() {
        val file = generateFile(100, "test1")
        var res = uploadFile(note.id, file)
            .andExpect { Assertions.assertThat(it.response.status).isEqualTo(200) }
            .andReturn()
        Assertions.assertThat(res.response.errorMessage).isNull()

        var savedBlobs = fileRepository.findAll()
        Assertions.assertThat(savedBlobs).hasSize(1)

        res = uploadFile(note.id, file)
            .andExpect { Assertions.assertThat(it.response.status).isEqualTo(200) }
            .andReturn()
        Assertions.assertThat(res.response.errorMessage).isNull()

        savedBlobs = fileRepository.findAll()
        Assertions.assertThat(savedBlobs).hasSize(1)
        Assertions.assertThat(savedBlobs[0].data).isEqualTo(file.bytes)
    }

    @Test
    @WithMockUser(defaultUserName)
    fun `cant download other user file`() {
        // Setup other user data
        val userRole = rolesRepository.findByName("ROLE_USER").first()
        val otherUser = User(0L, "other_user", "some-pass", true, listOf(userRole), "external_other_user")
        val actualOtherUser = userRepository.save(otherUser)
        val otherUserNotebook = NotebookDTO(0L, "other-t", "blue", actualOtherUser.id)
        val actualOtherUserNotebook = notebookService.save(otherUserNotebook)
        val otherUserNote = NoteDTO(0L, "other-n", "## other-n", actualOtherUserNotebook.id, false, null, arrayListOf())
        val actualOtherUserNote = notebookService.saveNote(otherUserNote)

        // upload data as other user
        val file = generateFile(100, "test1")
        val reqBuilder = MockMvcRequestBuilders.multipart("$FILE_API_URL/upload/${actualOtherUserNote.id}")
            .file(file)
            .contentType(MediaType.MULTIPART_FORM_DATA_VALUE)
            .with(user(actualOtherUser.username).password(actualOtherUser.password).roles("USER"))

        val res = mvcMock.perform(reqBuilder)
            .andExpect { Assertions.assertThat(it.response.status).isEqualTo(200) }
            .andReturn()
        Assertions.assertThat(res.response.errorMessage).isNull()

        val savedBlobs = fileRepository.findAll()
        Assertions.assertThat(savedBlobs).hasSize(1)
        Assertions.assertThat(savedBlobs.first().ownerId).isEqualTo(actualOtherUser.id)

        // try to download result
        downloadFile(savedBlobs[0].id!!)
            .andExpect { Assertions.assertThat(it.response.status).isEqualTo(404) }
    }

    @Test
    fun `cant query for file info's when not authenticated`() {
        val reqBuilder = MockMvcRequestBuilders.get("$FILE_API_URL/for-note/1")
        mvcMock.perform(reqBuilder)
            .andExpect{Assertions.assertThat(it.response.status).isEqualTo(403)}
    }

    @WithMockUser(defaultUserName)
    @Test
    fun `can query for file info's`() {
        fileRepository.save(Blob("test_filename", ByteArray(0), user.id, 15, note.id))
        val reqBuilder = MockMvcRequestBuilders.get("$FILE_API_URL/for-note/${note.id}")
        val answer = mvcMock.perform(reqBuilder)
            .andExpect{Assertions.assertThat(it.response.status).isEqualTo(200)}
            .andReturn()
        Assertions.assertThat(answer.response.contentAsString).isEqualTo("[{\"size\":15,\"fileName\":\"test_filename\"}]")
    }

    @Test
    @WithMockUser(secondUserName)
    fun `cant query for files info when not owner`() {
        fileRepository.save(Blob("test_filename", ByteArray(0), secondUser.id, 0, note.id))
        val reqBuilder = MockMvcRequestBuilders.get("$FILE_API_URL/for-note/1")
        mvcMock.perform(reqBuilder)
            .andExpect{Assertions.assertThat(it.response.status).isEqualTo(403)}
    }

    private fun uploadFile(noteId: Long, vararg files: MockMultipartFile): ResultActions {
        val reqBuilder = MockMvcRequestBuilders.multipart("$FILE_API_URL/upload/$noteId")
        files.forEach {
            reqBuilder.file(it)
        }
        reqBuilder.contentType(MediaType.MULTIPART_FORM_DATA_VALUE)

        return mvcMock.perform(
            reqBuilder
        )
    }

    private fun downloadFile(id: Long): ResultActions {
        return mvcMock.perform(
            MockMvcRequestBuilders.get("$FILE_API_URL/download/$id")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
        )
    }

    private fun generateFile(size: Int = 0, filename: String): MockMultipartFile {
        return MockMultipartFile("files", filename, MediaType.MULTIPART_FORM_DATA_VALUE, ByteArray(size))
    }

    companion object {
        private const val TEST_NOTEBOOK_ID = 0L
        private const val TEST_NOTE_ID = 0L
    }
}
