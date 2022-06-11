package ru.iliya132.inotes.mocks

import org.springframework.data.repository.CrudRepository
import ru.iliya132.inotes.models.base.BaseEntity
import java.util.*

open class GenericCrudMock<TEntity : BaseEntity> : CrudRepository<TEntity, Long> {
    val cache = HashMap<Long, TEntity>()
    override fun <S : TEntity> save(entity: S): S {
        cache[entity.id] = entity
        return entity
    }

    override fun <S : TEntity> saveAll(entities: MutableIterable<S>): MutableIterable<S> {
        entities.forEach { save(it) }
        return entities
    }

    override fun findById(id: Long): Optional<TEntity> {
        return Optional.ofNullable(cache[id])
    }

    override fun existsById(id: Long): Boolean {
        return cache.containsKey(id)
    }

    override fun findAll(): MutableIterable<TEntity> {
        return cache.values
    }

    override fun count(): Long {
        return cache.count().toLong()
    }

    override fun deleteAll() {
        cache.clear()
    }

    override fun deleteAll(entities: MutableIterable<TEntity>) {
        entities.forEach { cache.remove(it.id) }
    }

    override fun deleteAllById(ids: MutableIterable<Long>) {
        ids.forEach { cache.remove(it) }
    }

    override fun delete(entity: TEntity) {
        cache.remove(entity.id)
    }

    override fun deleteById(id: Long) {
        cache.remove(id)
    }

    override fun findAllById(ids: MutableIterable<Long>): MutableIterable<TEntity> {
        return ids.mapNotNull { cache[it] }.toMutableList()
    }
}