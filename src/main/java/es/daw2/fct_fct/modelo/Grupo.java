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
@Table(name = "grupos")
public class Grupo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "grupo_id")
    private Long id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "ciclo_id")
    private Ciclo ciclo;

    @Column(name = "name", nullable = false, columnDefinition = "varchar(255)")
    private String name;

    @Column(name = "acronimo", nullable = false, columnDefinition = "VARCHAR(10)")
    private String acronimo;

    @Column(name = "horario", nullable = false, columnDefinition = "ENUM('DIURNO', 'VESPERTINO', 'NOCHE')")
    private Horario horario;

    @Column(name = "ciclo_lectivo", nullable = false, columnDefinition = "VARCHAR(9)")
    private String cicloLectivo;

    public enum Horario {
        DIURNO,
        VESPERTINO,
        NOCHE
    }
}
