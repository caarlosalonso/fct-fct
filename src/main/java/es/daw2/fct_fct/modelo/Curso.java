package es.daw2.fct_fct.modelo;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
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
    @EmbeddedId
    private CursoId id;

    @ManyToOne
    @JsonIgnore
    @MapsId("alumnoId")
    @JoinColumn(name = "alumno_id")
    private Alumnos alumnos;

    @ManyToOne
    @JsonIgnore
    @MapsId("cicloId")
    @JoinColumn(name = "ciclo_id")
    private Ciclos ciclos;
    
    @Column(name = "horas_hechas", nullable = false, columnDefinition = "TINYINT UNSIGNED")
    private Short horasHechas;

}
