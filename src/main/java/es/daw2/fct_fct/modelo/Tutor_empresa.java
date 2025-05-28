package es.daw2.fct_fct.modelo;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tutores_empresas")
public class Tutor_empresa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    @Column(name = "nombre", nullable = false, columnDefinition = "VARCHAR(255)")
    private String nombre;

    @Email(regexp = ".+@.+\\..+")
    @Column(name = "email", nullable = false, columnDefinition = "VARCHAR(255)")
    private String email;

    @Column(name = "telefono", nullable = false, columnDefinition = "VARCHAR(15)")
    private String telefono;

    @Column(name = "dni", nullable = false, columnDefinition = "VARCHAR(9)")
    private String dni;
}
