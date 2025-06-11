package es.daw2.fct_fct.modelo.vistas;

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
@Table(name = "view_reviews")
public class ViewReviews {

    @Id
    @Column(name = "review_id")
    private Long reviewId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "empresa_id")
    private Long empresaId;

    @Column(name = "score")
    private Integer score;

    @Column(name = "comment")
    private String comment;

    @Column(name = "review_estado")
    private String reviewEstado;

    @Column(name = "propuesta_por")
    private Long propuestaPor;

    @Column(name = "observaciones")
    private String observaciones;

    @Column(name = "empresa_estado")
    private String empresaEstado;

    @Column(name = "nombre_empresa")
    private String nombreEmpresa;

    @Column(name = "nombre_usuario")
    private String nombreUsuario;

    @Column(name = "email")
    private String email;
}
