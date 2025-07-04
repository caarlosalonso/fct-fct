package es.daw2.fct_fct.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

public record VistaEmpresaTutorDTO(
    Long empresaId,
    String nombre,
    String cif,
    String phone,
    String email,
    String sector,
    String address,
    String persona_contacto,
    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate fecha_contacto,
    Long propuesta_por,
    Boolean hay_convenio,
    String numero_convenio,
    Integer numero_plazas,
    String observaciones,
    String estado,
    Long tutor_empresaId,
    String nombre_tutor,
    Long userId,
    String nombre_usuario
) {

}
