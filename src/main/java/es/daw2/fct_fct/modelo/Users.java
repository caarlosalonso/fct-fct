package es.daw2.fct_fct.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="users")
public class Users {
    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "name", nullable = false, columnDefinition = "varchar(255)")
    private String name;

    @Column(name = "email", nullable = false, columnDefinition = "varchar(255)")
    private String email;

    @Column(name = "password", nullable = false, columnDefinition = "varchar(255)")
    private String password;

    @Column(name = "updated_password", nullable = false, columnDefinition = "tinyint(1) default 0")
    private boolean updated_password;

    @Column(name = "is_admin", nullable = false, columnDefinition = "tinyint(1) default 0")
    private boolean is_admin;
}