package es.daw2.fct_fct.modelo;

import java.sql.Date;

import jakarta.validation.constraints.Email;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "empresas")
public class Empresa {
    @Id
    @GeneratedValue
    private Long empresa_id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "propuesta_por")
    private User propuesta_por;

    @Column(name = "observaciones", nullable = true, columnDefinition = "VARCHAR(2047)")
    private String observaciones;

    @Column(name = "estado", nullable = false, columnDefinition = "ENUM('PENDIENTE', 'ACEPTADO', 'DENEGADO')")
    public Estado estado;

    @Column(name = "nombre", nullable = false, columnDefinition = "VARCHAR(255)")
    private String nombre;

    @Column(name = "cif", nullable = true, columnDefinition = "varchar(9)")
    private String cif;

    @Email(regexp = ".+@.+\\..+")
    @Column(name = "email", nullable = true, columnDefinition = "VARCHAR(255)")
    private String email;

    @Column(name = "sector", nullable = true, columnDefinition = "varchar(255)")
    private String sector;

    @Column(name = "address", nullable = true, columnDefinition = "varchar(255)")
    private String address;

    @Column(name = "phone", nullable = true, columnDefinition = "varchar(15)")
    private String phone;

    @Column(name = "persona_contacto", nullable = true, columnDefinition = "varchar(255)")
    private String persona_contacto;

    @Column(name = "fecha_contacto", nullable = true, columnDefinition = "DATE")
    private Date fecha_contacto;

    @Column(name = "hay_convenio", nullable = true, columnDefinition = "TINYINT")
    private Boolean hay_contacto;

    @Column(name = "numero_convenio", nullable = true, columnDefinition = "VARCHAR(9)")
    private String numero_convenio;

    public enum Estado {
        PENDIENTE,
        ACEPTADO,
        DENEGADO
    }
}
