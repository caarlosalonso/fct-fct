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
@Table(name="anexos")
@AttributeOverride(name = "id", column = @Column(name = "anexo_id", nullable = false, columnDefinition = "BIGINT"))
public class Anexo extends AbsBaseEntity {

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "alumno_id")
    private Alumno alumno;

    @Column(name = "anexo_file", nullable = false, columnDefinition = "VARCHAR(255)")
    private String anexoFile;
}
