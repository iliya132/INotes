package ru.iliya132.inotes.models

import ru.iliya132.inotes.dto.SimpleUserDTO

class RegistrationResponse(
    var succeeded: Boolean,
    var user: SimpleUserDTO?,
    var error: String?
) : java.io.Serializable
