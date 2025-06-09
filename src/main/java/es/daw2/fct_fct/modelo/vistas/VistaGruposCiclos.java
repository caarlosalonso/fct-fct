package es.daw2.fct_fct.modelo.vistas;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Immutable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Immutable
@Table(name = "vista_grupos_ciclos")
public class VistaGruposCiclos {

    @Column(name = "ciclo_lectivo_id", nullable = false)
    private Long cicloLectivoId;

    @Id
    @Column(name = "grupo_id", nullable = false)
    private Long grupoId;

    @Column(name = "numero", nullable = false)
    private Integer numero;

    @Column(name = "ciclo_id", nullable = false)
    private Long cicloId;

    @Column(name = "grupo_nombre", nullable = false)
    private String grupoNombre;

    @Column(name = "tutor_id", nullable = false)
    private Long tutorId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "user_id", nullable = false)
    private Long userId;
}
