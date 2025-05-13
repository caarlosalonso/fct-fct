package es.daw2.fct_fct.modelo;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "plazas")
public class Plaza {
    @Id
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "empresa_id")
    private Empresas empresas;

    @Id
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "ciclo_id")
    private Ciclos ciclos;

    @Column(name = "plazas", nullable = false, columnDefinition = "INT")
    private Integer plazas;
}
