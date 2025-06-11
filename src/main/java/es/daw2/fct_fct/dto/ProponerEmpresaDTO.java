package es.daw2.fct_fct.dto;

public record ProponerEmpresaDTO(
    String nombre,
    String cif,
    String telefono,
    String email,
    String sector,
    String direccion,
    String personaContacto,
    String observaciones
) {}
