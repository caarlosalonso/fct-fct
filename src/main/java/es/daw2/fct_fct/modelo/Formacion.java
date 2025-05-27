package es.daw2.fct_fct.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "formaciones")
public class Formacion {
    @Id
    @GeneratedValue
    private Long formacion_id;

    @Column(name = "name", nullable = false, columnDefinition = "varchar(255)")
    private String name;

    @Column(name = "acronimo", nullable = false, columnDefinition = "varchar(10)")
    private String acronimo;

    @Column(name = "nivel", nullable = false, columnDefinition = "enum('BASICO', 'MEDIO', 'SUPERIOR')")
    private Nivel nivel;

    @Column(name = "familia_profesional", nullable = false, columnDefinition = "varchar(255)")
    private String familiaProfesional;

    @Column(name = "horas_practicas", nullable = false, columnDefinition = "TINYINT UNSIGNED")
    private Short horasPracticas;

    public enum Nivel {
        BASICO,
        MEDIO,
        SUPERIOR
    }
}
