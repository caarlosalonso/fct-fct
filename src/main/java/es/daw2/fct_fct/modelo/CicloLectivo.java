package es.daw2.fct_fct.modelo;

import java.time.LocalDate;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "ciclos_lectivos")
@AttributeOverride(name = "id", column = @Column(name = "ciclo_lectivo_id", nullable = false, columnDefinition = "BIGINT"))
public class CicloLectivo extends AbsBaseEntity {

    @Column(name = "nombre", nullable = false, columnDefinition = "VARCHAR(10)")
    private String nombre;

    @Column(name = "fecha_inicio", nullable = false, columnDefinition = "DATE")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin", nullable = false, columnDefinition = "DATE")
    private LocalDate fechaFin;
}
