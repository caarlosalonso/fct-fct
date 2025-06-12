package es.daw2.fct_fct.modelo.vistas;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Immutable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Immutable
@Table(name = "vista_coordinadores")
public class VistaCoordinadores {

    @Id
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "coordinacion_id", nullable = false)
    private Long coordinacionId;
}
