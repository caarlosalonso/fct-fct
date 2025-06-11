package es.daw2.fct_fct.modelo;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


@Data
@EqualsAndHashCode(callSuper = true)    // Se asegura de que la ID esté incluida en la comparación
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "fcts")
@AttributeOverride(name = "id", column = @Column(name = "fct_id", nullable = false, columnDefinition = "BIGINT"))
public class Fct extends AbsBaseEntity {

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "curso_id", nullable = false)
    private Curso curso;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "tutor_empresa_id", nullable = true)
    private TutorEmpresa tutorEmpresa;

    @Column(name = "motivo_renuncia", nullable = true, columnDefinition = "VARCHAR(45)")
    private String motivoRenuncia;

    @Column(name = "anexo_21", nullable = true, columnDefinition = "VARCHAR(5)")
    private String anexo21;

    @Column(name = "fecha_inicio", nullable = true, columnDefinition = "DATE")
    private LocalDate fechaInicio;

    @Column(name = "horas_semana", nullable = true, columnDefinition = "TINYINT DEFAULT 40")
    private Integer horasSemana;

    @Column(name = "no_lectivos", nullable = true, columnDefinition = "TINYINT")
    private Integer noLectivos;

    @Column(name = "horas_practicas", nullable = true, columnDefinition = "TINYINT")
    private Integer horasPracticas;

    @Column(name = "fecha_fin", nullable = true, columnDefinition = "DATE")
    private LocalDate fechaFin;

    @Column(name = "observaciones", nullable = true, columnDefinition = "VARCHAR(2047)")
    private String observaciones;

    @Column(name = "apto", nullable = true, columnDefinition = "TINYINT")
    private Boolean apto;
}
