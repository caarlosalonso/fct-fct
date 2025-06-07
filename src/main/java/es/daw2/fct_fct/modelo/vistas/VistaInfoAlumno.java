package es.daw2.fct_fct.modelo.vistas;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "vista_info_alumnos")
public class VistaInfoAlumno {

    @Id
    @Column(name = "id_alumno")
    private Long idAlumno;

    @Column(name = "nombre_usuario")
    private String nombreUsuario;

    @Column(name = "email_usuario")
    private String emailUsuario;

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

    @Column(name = "convocatoria")
    private int convocatoria;

    @Column(name = "id_curso")
    private Long idCurso;

    @Column(name = "horas_hechas")
    private Short horasHechas;

    @Column(name = "id_grupo")
    private Long idGrupo;

    @Column(name = "numero_grupo")
    private Short numeroGrupo;
}
