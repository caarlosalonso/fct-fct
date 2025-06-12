package es.daw2.fct_fct.modelo;

import java.time.LocalDateTime;

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
@Table(name = "reviews")
@AttributeOverride(name = "id", column = @Column(name = "review_id", nullable = false, columnDefinition = "BIGINT"))
public class Review extends AbsBaseEntity {

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    @Column(name = "score", nullable = false, columnDefinition = "TINYINT")
    private Byte score;

    @Column(name = "comment", nullable = true, columnDefinition = "VARCHAR(2047)")
    private String comment;

    @Column(name = "estado", nullable = false, columnDefinition = "ENUM('VISIBLE', 'ELIMINADO') DEFAULT 'VISIBLE'")
    private Estado estado;

    @Column(name = "made_at", nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime madeAt;

    @Column(name = "last_updated", nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime lastUpdated;

    public enum Estado {
        VISIBLE,
        ELIMINADO
    }
}
