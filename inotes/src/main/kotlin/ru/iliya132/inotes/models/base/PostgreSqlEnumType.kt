package ru.iliya132.inotes.models.base

import org.hibernate.HibernateException
import org.hibernate.engine.spi.SharedSessionContractImplementor
import org.hibernate.type.EnumType
import ru.iliya132.inotes.models.VerificationType
import java.sql.PreparedStatement
import java.sql.SQLException
import java.sql.Types

class PostgreSQLVerificationTypeEnumType : EnumType<VerificationType>() {
    @Throws(HibernateException::class, SQLException::class)
    override fun nullSafeSet(
        st: PreparedStatement,
        value: Any?,
        index: Int,
        session: SharedSessionContractImplementor) {
        if (value==null) {
            st.setNull(index, Types.OTHER)
        } else {
            st.setObject(
                index,
                value.toString(),
                Types.OTHER
            )
        }
    }
}