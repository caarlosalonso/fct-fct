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
@Table(name="alumnos")
public class Alumno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "alumno_id", columnDefinition = "BIGINT UNSIGNED")
    private Long alumno_id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "convocatoria", nullable = false, columnDefinition = "int default 3")
    private int convocatoria;

    @Column(name = "nombre", nullable = true, columnDefinition = "varchar(255)")
    private String nombre;

    @Column(name = "dni", nullable = true, columnDefinition = "varchar(9)")
    private String dni;

    @Column(name = "nia", nullable = true, columnDefinition = "varchar(8)")
    private String nia;

    @Column(name = "nuss", nullable = true, columnDefinition = "varchar(11)")
    private String nuss;

    @Column(name = "phone", nullable = true, columnDefinition = "varchar(15)")
    private String phone;

    @Column(name = "address", nullable = true, columnDefinition = "varchar(255)")
    private String address;

    @Column(name = "curriculum_file", nullable = true, columnDefinition = "VARCHAR(255)")
    private String curriculumFile;

    @Column(name = "anexo_ocho", nullable = true, columnDefinition = "VARCHAR(255)")
    private String anexoOcho;
}
