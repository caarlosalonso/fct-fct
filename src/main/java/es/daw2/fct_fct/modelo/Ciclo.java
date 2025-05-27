package es.daw2.fct_fct.modelo;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
@Table(name = "ciclos")
public class Ciclo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ciclo_id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "formacion_id")
    private Formacion formacion;

    @Column(name = "name", nullable = false, columnDefinition = "varchar(255)")
    private String name;

    @Column(name = "acronimo", nullable = false, columnDefinition = "VARCHAR(10)")
    private String acronimo;

    @Column(name = "horario", nullable = false, columnDefinition = "ENUM('DIURNO', 'VESPERTINO', 'NOCHE')")
    private Horario horario;

    public enum Horario {
        DIURNO,
        VESPERTINO,
        NOCHE
    }
}
