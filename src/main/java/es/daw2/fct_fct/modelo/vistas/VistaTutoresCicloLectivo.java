package es.daw2.fct_fct.modelo.vistas;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vista_tutores_ciclo_lectivo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VistaTutoresCicloLectivo {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "tutor_id")
    private Long tutorId;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "grupo_id")
    private Long grupoId;

    @Column(name = "numero")
    private Integer numero;

    @Column(name = "ciclo_id")
    private Long cicloId;

    @Column(name = "ciclo_lectivo_id")
    private Long cicloLectivoId;

    @Column(name = "nombre")
    private String nombre;
}
