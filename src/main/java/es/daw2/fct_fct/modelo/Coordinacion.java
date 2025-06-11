package es.daw2.fct_fct.modelo;

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
@Table(name = "coordinaciones")
@AttributeOverride(name = "id", column = @Column(name = "coordinacion_id", nullable = false, columnDefinition = "BIGINT"))
public class Coordinacion extends AbsBaseEntity {

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
