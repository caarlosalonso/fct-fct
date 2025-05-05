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
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ciclos")
public class Ciclos {
    @Id
    @GeneratedValue
    private int id;

    @Column(name = "name", nullable = false, columnDefinition = "varchar(255)")
    private String name;

    @Column(name = "year", nullable = false)
    private Short year;

    @Column(name = "nivel", nullable = false, columnDefinition = "enum('MEDIO','SUPERIOR')")
    private Nivel nivel;

    @Column(name = "familia_profesional", nullable = false, columnDefinition = "varchar(255)")
    private String familiaProfesional;

    public enum Nivel {
        MEDIO,
        SUPERIOR
    }
}
