package ru.iliya132.inotes.models.converter

import ru.iliya132.inotes.models.VerificationType
import javax.persistence.AttributeConverter
import javax.persistence.Converter

@Converter(autoApply = true)
class VerificationCodeTypeConverter : AttributeConverter<VerificationType, String>{
    override fun convertToDatabaseColumn(value: VerificationType?): String? {
        return value?.name
    }

    override fun convertToEntityAttribute(value: String?): VerificationType? {
        return if(value == null) null else VerificationType.valueOf(value)
    }
}