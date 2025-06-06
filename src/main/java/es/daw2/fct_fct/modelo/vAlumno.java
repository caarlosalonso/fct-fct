package es.daw2.fct_fct.modelo;

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
@Table(name = "v_alumnos")
public class vAlumno {

    @Id
    @Column(name = "user_id", nullable = false, columnDefinition = "BIGINT")
    private Long id;

    @Column(name = "acronimo" , nullable = false, columnDefinition = "VARCHAR(10)")
    private String ciclo;

    @Column(name = "numero" , nullable = false, columnDefinition = "TINYINT")
    private Short grupo;

    @Column(name = "fecha_inicio" , nullable = false, columnDefinition = "INT")
    private Integer año;

}
