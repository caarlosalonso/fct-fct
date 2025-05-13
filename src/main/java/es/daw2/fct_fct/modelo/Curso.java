package es.daw2.fct_fct.modelo;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "cursos")
public class Curso {
    @Id
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "alumno_id")
    private Alumnos alumnos;

    @Id
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "ciclo_id")
    private Ciclos ciclos;
    
    @Id
    @Column(name = "year", nullable = false, columnDefinition = "UNSIGNED TINYINT")
    private Short year;

    @Column(name = "horas_hechas", nullable = false, columnDefinition = "UNSIGNED TINYINT")
    private Short horasHechas;

}
