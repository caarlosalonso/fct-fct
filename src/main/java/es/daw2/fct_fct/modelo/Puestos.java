package es.daw2.fct_fct.modelo;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "puestos")
public class Puestos {
    @Id
    @GeneratedValue
    private int id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn
    private Empresas empresa;

    @ManyToOne
    @JsonIgnore
    @JoinColumn
    private Ciclos ciclo;
}
