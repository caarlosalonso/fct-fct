package es.daw2.fct_fct.modelo.vistas;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "vista_alumno_ciclos")
public class VistaAlumnoCiclos {

    @Id
    @Column(name = "ciclo_lectivo_id")
    private Long cicloLectivoId;

    @Column(name = "grupo_id")
    private Long grupoId;

    @Column(name = "numero")
    private Integer numero;

    @Column(name = "ciclo_id")
    private Long cicloId;

    @Column(name = "grupo_nombre")
    private String grupoNombre;

    @Column(name = "alumno_id")
    private Long alumnoId;
}
