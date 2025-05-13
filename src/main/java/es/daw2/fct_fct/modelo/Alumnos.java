package es.daw2.fct_fct.modelo;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
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
public class Alumnos {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "user_id")
    private Users user;

    @Column(name = "dni", nullable = false, columnDefinition = "varchar(9)")
    private String dni;

    @Column(name = "phone", nullable = false, columnDefinition = "varchar(15)")
    private String phone;

    @Column(name = "adress", nullable = false, columnDefinition = "varchar(255)")
    private String address;

    @Column(name = "convocatoria", nullable = false, columnDefinition = "int default 3")
    private int convocatoria;

    @Column(name = "curriculum_file", nullable = true, columnDefinition = "VARCHAR(255)")
    private String curriculumFile;
}
