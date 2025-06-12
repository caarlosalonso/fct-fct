package es.daw2.fct_fct.modelo.vistas;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vista_all_alumnos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VistaAllAlumnos {

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
}
