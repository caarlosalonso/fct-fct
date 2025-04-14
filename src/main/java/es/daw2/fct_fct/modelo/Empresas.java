package es.daw2.fct_fct.modelo;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "empresas")
public class Empresas {
    @Id
    @GeneratedValue
    private int id;
    @Column(name = "cif", nullable = false, columnDefinition = "varchar(45)")
    private String cif;
    @Column(name = "sector", nullable = false, columnDefinition = "varchar(45)")
    private String sector;
    @Column(name = "address", nullable = false, columnDefinition = "varchar(45)")
    private String address;
    @Column(name = "phone", nullable = false, columnDefinition = "varchar(45)")
    private String phone;
    @Column(name = "personaContacto", nullable = false, columnDefinition = "varchar(45)")
    private String personaContacto;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "user_id")
    private Users user;
}
