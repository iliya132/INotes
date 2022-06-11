package ru.iliya132.inotes.mocks

import ru.iliya132.inotes.models.Role
import ru.iliya132.inotes.repositories.RolesRepository
import java.util.*

class RolesRepositoryMock : RolesRepository {
	private val cache: HashMap<Long, Role> = HashMap()
	var incrementId = 0L
	override fun findByName(roleName: String): Collection<Role> {
		return cache.values.filter { it.name == roleName }
	}

	override fun <S : Role> save(entity: S): S {

		if (entity.id == 0L || !cache.containsKey(entity.id)) {
			val result = entity.copy(id = incrementId++)
			cache[result.id] = result
			return result as S
		} else {
			throw org.springframework.dao.DuplicateKeyException("Key $entity.id already exists")
		}

	}

	override fun <S : Role?> saveAll(entities: MutableIterable<S>): MutableIterable<S> {
		return entities.mapNotNull { save(it as Role) as S }.toMutableList()
	}

	override fun findById(id: Long): Optional<Role> {
		return Optional.ofNullable(cache[id])
	}

	override fun existsById(id: Long): Boolean {
		return findById(id).isPresent
	}

	override fun findAll(): MutableIterable<Role> {
		return cache.values
	}

	override fun count(): Long {
		return cache.count().toLong()
	}

	override fun deleteAll() {
		cache.clear()
	}

	override fun deleteAll(entities: MutableIterable<Role>) {
		entities.forEach { cache.remove(it.id) }
	}

	override fun deleteAllById(ids: MutableIterable<Long>) {
		ids.forEach { cache.remove(it) }
	}

	override fun delete(entity: Role) {
		cache.remove(entity.id)
	}

	override fun deleteById(id: Long) {
		cache.remove(id)
	}

	override fun findAllById(ids: MutableIterable<Long>): MutableIterable<Role> {
		return ids.map { cache[it] as Role }.toMutableList()
	}
}