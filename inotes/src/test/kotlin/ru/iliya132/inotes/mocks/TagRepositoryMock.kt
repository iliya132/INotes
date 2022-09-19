package ru.iliya132.inotes.mocks

import ru.iliya132.inotes.models.Tag
import ru.iliya132.inotes.models.TagKey
import ru.iliya132.inotes.repositories.TagRepository
import java.util.*

class TagRepositoryMock : GenericCrudMock<Tag, TagKey>(), TagRepository {
    override fun deleteAllByNoteId(noteId: Long) {
        val toRemove = cache.filter { it.key.noteId == noteId }
        if(toRemove.isNotEmpty()){
           cache.remove(toRemove.keys.first())
        }
    }

    override fun getByNoteId(noteId: Long): List<String> {
        return cache.filter { it.key.noteId == noteId }.map { it.value.tag }
    }

    override fun getByUserId(userId: Long): List<String> {
        return cache.values.map { it.tag }
    }

    override fun findById(id: TagKey): Optional<Tag> {
        return Optional.ofNullable(cache[id])
    }

    override fun existsById(id: TagKey): Boolean {
        return cache.containsKey(id)
    }

    override fun findAllById(ids: MutableIterable<TagKey>): MutableIterable<Tag> {
        return cache.filter { ids.contains(it.key) }.values.toMutableList()
    }

    override fun deleteById(id: TagKey) {
        val toDelete = cache.filter { it.key == id }
        if(toDelete.isNotEmpty()){
            cache.remove(toDelete.keys.first())
        }
    }

    override fun deleteAllById(ids: MutableIterable<TagKey>) {
        ids.forEach { deleteById(it) }
    }
}