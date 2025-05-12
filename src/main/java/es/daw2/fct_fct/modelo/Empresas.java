package es.daw2.fct_fct.modelo;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "empresas")
public class Empresas {
    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "estado", nullable = false, columnDefinition = "ENUM('PENDIENTE', 'ACEPTADO', 'DENEGADO')")
    public Estado estado;

    @Column(name = "cif", nullable = true, columnDefinition = "varchar(9)")
    private String cif;

    @Column(name = "sector", nullable = true, columnDefinition = "varchar(255)")
    private String sector;

    @Column(name = "address", nullable = true, columnDefinition = "varchar(255)")
    private String address;

    @Column(name = "phone", nullable = true, columnDefinition = "varchar(15)")
    private String phone;

    @Column(name = "persona_contacto", nullable = true, columnDefinition = "varchar(255)")
    private String persona_contacto;

    @Column(name = "fecha_contacto", nullable = true, columnDefinition = "DATE")
    private Date fecha_contacto;

    public enum Estado {
        PENDIENTE,
        ACEPTADO,
        DENEGADO
    }
}
