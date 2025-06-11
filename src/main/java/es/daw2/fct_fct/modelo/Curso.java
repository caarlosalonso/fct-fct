package es.daw2.fct_fct.modelo;

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
@Table(name = "cursos")
@AttributeOverride(name = "id", column = @Column(name = "curso_id", nullable = false, columnDefinition = "BIGINT"))
public class Curso extends AbsBaseEntity {

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "alumno_id", nullable = false)
    private Alumno alumno;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "grupo_id", nullable = false)
    private Grupo grupo;

    @Column(name = "horas_hechas", nullable = false, columnDefinition = "TINYINT UNSIGNED")
    private Short horasHechas;

    @Column(name = "rating", nullable = true, columnDefinition = "VARCHAR(15) DEFAULT 'Verde'")
    private String rating;

    @Column(name = "posibles_empresas", nullable = false, columnDefinition = "VARCHAR(1023) DEFAULT ''")
    private String posiblesEmpresas;

    @Column(name = "observaciones", nullable = true, columnDefinition = "VARCHAR(2047)")
    private String observaciones;
}
