package es.daw2.fct_fct.modelo;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class CursoId implements Serializable {
    private Long alumnoId;
    private Long cicloId;
    private Short year;
}
