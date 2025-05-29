package es.daw2.fct_fct.modelo;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="anexos")
public class Anexo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "anexo_id")
    private Long id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "alumno_id")
    private Alumno alumno;

    @Column(name = "anexo_file", nullable = false, columnDefinition = "VARCHAR(255)")
    private String anexoFile;
}
