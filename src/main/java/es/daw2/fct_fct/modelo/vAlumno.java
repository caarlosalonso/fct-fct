package es.daw2.fct_fct.modelo;

import java.time.LocalDate;

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
@Table(name = "vAlumnos")
public class vAlumno {

    @Id
    @Column(name = "user_id")
    private Long id;

    @Column(name = "nombre")
    private String name;

    @Column(name = "ciclo")
    private String ciclo;

    @Column(name = "grupo")
    private Integer grupo;

    @Column(name = "year")
    private LocalDate año;

}
