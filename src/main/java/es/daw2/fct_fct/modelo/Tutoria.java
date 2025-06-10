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
@Table(name = "tutorias")
@AttributeOverride(name = "id", column = @Column(name = "tutoria_id", nullable = false, columnDefinition = "BIGINT"))
public class Tutoria extends AbsBaseEntity {

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "grupo_id")
    private Grupo grupo;

    @Column(name = "fecha", nullable = false, columnDefinition = "DATE")
    private LocalDateTime fecha;

}
