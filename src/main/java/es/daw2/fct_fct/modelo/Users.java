package es.daw2.fct_fct.modelo;

import javax.validation.constraints.Email;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="users")
public class Users {
    @Id
    @GeneratedValue
    private Long id;

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

    public Users(String email, String password) {
        this.name = "";
        this.password = password;
        this.email = email;
        this.isAdmin = false;
    }
}