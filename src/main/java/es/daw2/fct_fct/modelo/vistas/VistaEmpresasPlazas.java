package es.daw2.fct_fct.modelo.vistas;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "vista_empresas_plazas")
public class VistaEmpresasPlazas {

    @Id
    @Column(name = "empresa_id", nullable = false)
    private Long empresaId;

    @Column(name = "propuesta_por", nullable = false)
    private Long propuestaPor;

    @Column(name = "observaciones", length = 2047)
    private String observaciones;

    @Column(name = "estado", length = 50)
    private String estado;

    @Column(name = "nombre_empresa", nullable = false, length = 255)
    private String nombreEmpresa;

    @Column(name = "cif", nullable = false)
    private String cif;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "sector", nullable = false)
    private String sector;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "persona_contacto", nullable = false)
    private String personaContacto;

    @Column(name = "fecha_contacto", nullable = false)
    private LocalDate fechaContacto;

    @Column(name = "hay_convenio", nullable = false)
    private Boolean hayConvenio;

    @Column(name = "numero_convenio", nullable = false)
    private String numeroConvenio;

    @Column(name = "plaza_id", nullable = false)
    private Long plazaId;

    @Column(name = "plazas", nullable = false)
    private Integer plazas;

    @Column(name = "ciclo_id", nullable = false)
    private Long cicloId;

    @Column(name = "nombre_ciclo", nullable = false)
    private String nombreCiclo;

    @Column(name = "acronimo", nullable = false)
    private String acronimo;

    @Column(name = "nivel", nullable = false)
    private String nivel;

    @Column(name = "familia_profesional", nullable = false)
    private String familiaProfesional;

    @Column(name = "horas_practicas", nullable = false)
    private Integer horasPracticas;
}
