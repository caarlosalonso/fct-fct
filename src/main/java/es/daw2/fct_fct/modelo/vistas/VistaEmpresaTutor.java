package es.daw2.fct_fct.modelo.vistas;

import java.time.LocalDate;

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
@Table(name = "vista_empresas_tutores")
public class VistaEmpresaTutor {

    @Id
    @Column(name = "empresa_id", nullable = false)
    private Long empresaId;

    @Column(name = "nombre", nullable = false, length = 255)
    private String nombre;

    @Column(name = "cif", nullable = false)
    private String cif;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "sector", nullable = false)
    private String sector;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "persona_contacto", nullable = false)
    private String persona_contacto;

    @Column(name = "fecha_contacto", nullable = false)
    private LocalDate fecha_contacto;

    @Column(name = "propuesta_por", nullable = false)
    private Long propuesta_por;

    @Column(name = "hay_convenio", nullable = false)
    private Boolean hay_convenio;

    @Column(name = "numero_convenio", nullable = false)
    private String numero_convenio;

    @Column(name = "numero_plazas", nullable = false)
    private Integer numero_plazas;

    @Column(name = "observaciones", length = 2047)
    private String observaciones;

    @Column(name = "estado", length = 50)
    private String estado;

    
    @Column(name = "tutor_empresa_id")
    private Long tutor_empresaId;

    @Column(name = "nombre_tutor", length = 255)
    private String nombre_tutor;

    @Column(name = "id_usuario")
    private Long userId;

    @Column(name = "nombre_usuario", length = 255)
    private String nombre_usuario;
}
