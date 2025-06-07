package es.daw2.fct_fct.modelo.vistas;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Immutable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Immutable
@Table(name = "vista_alumnos")
public class VistaAlumno {

    @Id
    @Column(name = "ciclo_lectivo_id", nullable = false)
    private Long cicloLectivoId;

    @Column(name = "curso_id", nullable = false)
    private Long cursoId;

    @Column(name = "nombre_ciclo_lectivo", nullable = false, length = 10)
    private String nombreCicloLectivo;

    @Column(name = "grupo_id", nullable = false)
    private Long grupoId;

    @Column(name = "grupo_nombre", nullable = false, length = 50)
    private String grupoNombre;

    @Column(name = "alumno_id", nullable = false)
    private Long alumnoId;

    @Column(name = "nombre_alumno", nullable = false, length = 255)
    private String nombreAlumno;

    @Column(name = "dni", length = 9)
    private String dni;

    @Column(name = "nia", length = 8)
    private String nia;

    @Column(name = "nuss", length = 11)
    private String nuss;

    @Column(name = "telefono_alumno", length = 15)
    private String telefonoAlumno;

    @Column(name = "direccion_alumno", length = 255)
    private String direccionAlumno;

    @Column(name = "convocatoria", nullable = false)
    private Integer convocatoria;

}
