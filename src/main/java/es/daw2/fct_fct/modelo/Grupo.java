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
@Table(name = "grupos")
@AttributeOverride(name = "id", column = @Column(name = "grupo_id", nullable = false, columnDefinition = "BIGINT"))
public class Grupo extends AbsBaseEntity {

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
