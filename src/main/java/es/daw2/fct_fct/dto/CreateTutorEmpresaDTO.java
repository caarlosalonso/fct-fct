package es.daw2.fct_fct.dto;

public record CreateTutorEmpresaDTO(
    Long empresaId,
    String nombre,
    String email,
    String telefono,
    String dni
) {}
