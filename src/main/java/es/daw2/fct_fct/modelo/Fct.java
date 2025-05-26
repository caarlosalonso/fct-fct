package es.daw2.fct_fct.modelo;

import java.time.LocalDate;

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
@Table(name = "alumnos_has_ciclos")
public class Fct {
    @Id
    @GeneratedValue
    private Long fct_id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "alumno_id")
    private Alumno alumno;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "tutor_id")
    private Tutor tutor;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "empresa_id")
    private Empresa empresa;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "ciclo_id")
    private Ciclo ciclo;

    @Column(name = "fecha_inicio", nullable = true)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin", nullable = true)
    private LocalDate fechaFin;

    @Column(name = "observaciones", nullable = true, columnDefinition = "VARCHAR(2047)")
    private String observaciones;

    @Column(name = "apto", nullable = true, columnDefinition = "TINYINT")
    private Boolean apto;
}
