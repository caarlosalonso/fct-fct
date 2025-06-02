package es.daw2.fct_fct.modelo;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


@Data
@EqualsAndHashCode(callSuper = true)    // Se asegura de que la ID esté incluida en la comparación
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="archivos")
@AttributeOverride(name = "id", column = @Column(name = "archivo_id", nullable = false, columnDefinition = "BIGINT"))
public class Archivo extends AbsBaseEntity {

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "alumno_id")
    private Alumno alumno;

    @Column(name = "name", nullable = false, columnDefinition = "VARCHAR(255)")
    private String name;

    @Column(name = "file", nullable = false, columnDefinition = "VARCHAR(255)")
    private String file;

    @Column(name = "type", nullable = false, columnDefinition = "ENUM('CV', 'ANEXO', 'JUSTIFICANTE', 'OTRO')")
    private Type type;

    public enum Type {
        CV,
        ANEXO,
        JUSTIFICANTE,
        OTRO
    }
}
