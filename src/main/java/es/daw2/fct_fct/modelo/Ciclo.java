package es.daw2.fct_fct.modelo;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "ciclos")
@AttributeOverride(name = "id", column = @Column(name = "ciclo_id", nullable = false, columnDefinition = "BIGINT"))
public class Ciclo extends AbsBaseEntity {

    @Column(name = "name", nullable = false, columnDefinition = "varchar(255)")
    private String name;

    @Column(name = "acronimo", nullable = false, columnDefinition = "varchar(10)")
    private String acronimo;

    @Column(name = "nivel", nullable = false, columnDefinition = "enum('BASICO', 'MEDIO', 'SUPERIOR')")
    private Nivel nivel;

    @Column(name = "familia_profesional", nullable = false, columnDefinition = "varchar(255)")
    private String familiaProfesional;

    @Column(name = "years", nullable = false, columnDefinition = "TINYINT UNSIGNED")
    private Short years;

    @Column(name = "horas_practicas", nullable = false, columnDefinition = "SMALLINT UNSIGNED")
    private Integer horasPracticas;

    public enum Nivel {
        BASICO,
        MEDIO,
        SUPERIOR
    }
}
