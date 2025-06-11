package es.daw2.fct_fct.dto;

import java.time.LocalDate;

public record VistaEmpresaTutorDTO(
    Long empresaId,
    String nombre,
    String cif,
    String phone,
    String email,
    String sector,
    String address,
    String personaContacto,
    LocalDate fecha_contacto,
    Long propuestaPor,
    Boolean hayConvenio,
    String numeroConvenio,
    Integer numero_plazas,
    String observaciones,
    String estado,
    Long tutor_empresaId,
    String nombre_tutor,
    Long userId,
    String nombre_usuario
) {

}
