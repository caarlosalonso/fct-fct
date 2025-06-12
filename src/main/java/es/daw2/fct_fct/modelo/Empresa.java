package es.daw2.fct_fct.modelo;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "empresas")
@AttributeOverride(name = "id", column = @Column(name = "empresa_id", nullable = false, columnDefinition = "BIGINT"))
public class Empresa extends AbsBaseEntity {

    @ManyToOne
    @JsonIgnoreProperties({"empresas", "hibernateLazyInitializer", "handler"})
    @JoinColumn(name = "propuesta_por")
    private User propuesta_por;

    @Column(name = "observaciones", nullable = true, columnDefinition = "VARCHAR(2047)")
    private String observaciones;

    @Column(name = "estado", nullable = false, columnDefinition = "varchar(15)")
    public String estado;

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

    @Column(name = "numero_plazas" , nullable = true, columnDefinition = "INT")
    private Integer numero_plazas;

    @Column(name = "persona_contacto", nullable = true, columnDefinition = "varchar(255)")
    private String persona_contacto;

    @Column(name = "hay_convenio", nullable = true, columnDefinition = "TINYINT")
    private Boolean hay_convenio;

    @Column(name = "numero_convenio", nullable = true, columnDefinition = "VARCHAR(9)")
    private String numero_convenio;

    @Column(name = "fecha_contacto", nullable = true, columnDefinition = "DATE")
    private LocalDate fecha_contacto;
}
