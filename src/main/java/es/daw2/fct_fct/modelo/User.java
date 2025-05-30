package es.daw2.fct_fct.modelo;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


@Data
@EqualsAndHashCode(callSuper = true)    // Se asegura de que la ID esté incluida en la comparación
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="users")
@AttributeOverride(name = "id", column = @Column(name = "user_id", nullable = false, columnDefinition = "BIGINT"))
public class User extends AbsBaseEntity {

    @Column(name = "name", nullable = false, columnDefinition = "varchar(255)")
    private String name;

    @Email(regexp = ".+@.+\\..+")
    @Column(name = "email", nullable = false, columnDefinition = "varchar(255)")
    private String email;

    @Column(name = "password", nullable = false, columnDefinition = "varchar(255)")
    private String password;

    @Column(name = "updated_password", nullable = false, columnDefinition = "TINYINT DEFAULT 0")
    private boolean updatedPassword;

    @Column(name = "is_admin", nullable = false, columnDefinition = "TINYINT DEFAULT 0")
    private boolean isAdmin;
}
