package es.daw2.fct_fct.modelo;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "cursos")
public class Curso {
    @Id
    @GeneratedValue
    private Long curso_id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "alumno_id")
    private Alumno alumnos;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "ciclo_id")
    private Ciclo ciclos;
    
    @Column(name = "horas_hechas", nullable = false, columnDefinition = "TINYINT UNSIGNED")
    private Short horasHechas;

}
