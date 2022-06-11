package ru.iliya132.inotes.mocks

import ru.iliya132.inotes.models.User
import ru.iliya132.inotes.repositories.UserRepository
import java.util.*

class UserRepositoryMock : UserRepository {
	private val cache: HashMap<Long, User> = HashMap()
	var incrementId = 0L

	override fun findByUserName(username: String): User? {
		return cache.values.firstOrNull { it.username == username }
	}

	override fun existsByUserName(username: String): Boolean {
		return findByUserName(username) != null
	}

	override fun <S : User> save(entity: S): S {

		if (entity.id == 0L || !cache.containsKey(entity.id)) {
			val result = entity.copy(id = incrementId++)
			cache[result.id] = result
			return result as S
		} else {
			throw org.springframework.dao.DuplicateKeyException("Key $entity.id already exists")
		}

	}

	override fun <S : User?> saveAll(entities: MutableIterable<S>): MutableIterable<S> {
		return entities.mapNotNull { save(it as User) as S }.toMutableList()
	}

	override fun findById(id: Long): Optional<User> {
		return Optional.ofNullable(cache[id])
	}

	override fun existsById(id: Long): Boolean {
		return findById(id).isPresent
	}

	override fun findAll(): MutableIterable<User> {
		return cache.values
	}

	override fun count(): Long {
		return cache.count().toLong()
	}

	override fun deleteAll() {
		cache.clear()
	}

	override fun deleteAll(entities: MutableIterable<User>) {
		entities.forEach { cache.remove(it.id) }
	}

	override fun deleteAllById(ids: MutableIterable<Long>) {
		ids.forEach { cache.remove(it) }
	}

	override fun delete(entity: User) {
		cache.remove(entity.id)
	}

	override fun deleteById(id: Long) {
		cache.remove(id)
	}

	override fun findAllById(ids: MutableIterable<Long>): MutableIterable<User> {
		return ids.map { cache[it] as User }.toMutableList()
	}
}