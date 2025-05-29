package es.daw2.fct_fct.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
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

    public User(String name, String email, String password) {
        this.name = name;
        this.password = password;
        this.email = email;
        this.isAdmin = false;
    }

    public User(String email, String password) {
        this.name = "";
        this.password = password;
        this.email = email;
        this.isAdmin = false;
    }
}