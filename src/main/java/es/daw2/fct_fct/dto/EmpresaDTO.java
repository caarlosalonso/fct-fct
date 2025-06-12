package es.daw2.fct_fct.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class EmpresaDTO {
    private String nombre;
    private String cif;
    private String sector;
    private String address;
    private String phone;
    private String email;
    private String persona_contacto;
    private String estado;
    private String observaciones;
    private String numero_convenio;
    private Long propuesta_por; // Solo el id del usuario
    private Integer numero_plazas;
    private LocalDate fecha_contacto; // Fecha de contacto con la empresa
}