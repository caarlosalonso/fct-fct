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
    @Column(name = "tutor_id", nullable = false)
    private Long tutorId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "nombre_alumno", nullable = false, length = 255)
    private String nombreAlumno;

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "alumno_id", nullable = false)
    private Long alumnoId;

    @Column(name = "convocatoria", nullable = false)
    private Integer convocatoria;

    @Column(name = "dni", length = 9)
    private String dni;

    @Column(name = "nia", length = 8)
    private String nia;

    @Column(name = "nuss", length = 11)
    private String nuss;

    @Column(name = "phone", length = 15)
    private String phone;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "curso_id", nullable = false)
    private Long cursoId;

    @Column(name = "horas_hechas")
    private Integer horasHechas;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "observaciones", length = 2047)
    private String observaciones;

    @Column(name = "posibles_empresas", nullable = false, length = 1023)
    private String posiblesEmpresas;

    @Column(name = "grupo_id", nullable = false)
    private Long grupoId;
    
    @Column(name = "numero", nullable = false)
    private Integer numero;

    @Column(name = "ciclo_lectivo_id", nullable = false)
    private Long cicloLectivoId;

    @Column(name = "nombre_ciclo_lectivo", nullable = false, length = 10)
    private String nombreCicloLectivo;

    @Column(name = "grupo_nombre", nullable = false, length = 50)
    private String grupoNombre;
}
