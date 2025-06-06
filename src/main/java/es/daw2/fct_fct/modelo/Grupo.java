package es.daw2.fct_fct.modelo;

import java.time.LocalDateTime;

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
@Table(name = "grupos")
@AttributeOverride(name = "id", column = @Column(name = "grupo_id", nullable = false, columnDefinition = "BIGINT"))
public class Grupo extends AbsBaseEntity {

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "ciclo_id")
    private Ciclo ciclo;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "ciclo_lectivo_id")
    private CicloLectivo cicloLectivo;

    @Column(name = "numero", nullable = false, columnDefinition = "TINYINT UNSIGNED")
    private Short numero;

    @Column(name = "horario", nullable = false, columnDefinition = "VARCHAR(15)")
    private String horario;

    @Column(name = "anexo_ocho", nullable = true, columnDefinition = "VARCHAR(255)")
    private String anexoOcho;

    @Column(name = "deleted_at", nullable = true, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime deletedAt;
}
