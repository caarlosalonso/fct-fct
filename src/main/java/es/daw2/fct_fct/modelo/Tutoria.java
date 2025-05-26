package es.daw2.fct_fct.modelo;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
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
@Table(name = "tutorias")
public class Tutoria {
    @Id
    @GeneratedValue
    private Long tutoria_id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "tutor_id")
    private Tutor tutor;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "ciclo_id")
    private Ciclo ciclo;

    @Column(name = "year", nullable = false, columnDefinition = "SMALLINT")
    private Short year;

}
