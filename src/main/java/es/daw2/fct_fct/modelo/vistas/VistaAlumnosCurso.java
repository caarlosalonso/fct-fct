package es.daw2.fct_fct.modelo.vistas;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vista_alumnos_curso")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VistaAlumnosCurso {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "nombre_alumno")
    private String nombreAlumno;

    @Column(name = "email")
    private String email;

    @Column(name = "alumno_id")
    private Long alumnoId;

    @Column(name = "convocatoria")
    private String convocatoria;

    @Column(name = "dni")
    private String dni;

    @Column(name = "nia")
    private String nia;

    @Column(name = "nuss")
    private String nuss;

    @Column(name = "phone")
    private String phone;

    @Column(name = "address")
    private String address;

    @Column(name = "curso_id")
    private Long cursoId;

    @Column(name = "horas_hechas")
    private Integer horasHechas;

    @Column(name = "rating")
    private String rating;

    @Column(name = "observaciones")
    private String observaciones;

    @Column(name = "a_extraordinaria")
    private Integer aExtraordinaria;

    @Column(name = "posibles_empresas", nullable = false, length = 1023)
    private String posiblesEmpresas;

    @Column(name = "grupo_id")
    private Long grupoId;
}
