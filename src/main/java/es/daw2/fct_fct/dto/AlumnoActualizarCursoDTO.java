package es.daw2.fct_fct.dto;

public record AlumnoActualizarCursoDTO(
    String name,
    String email,
    String phone,
    String nia,
    String dni,
    String nuss,
    String address,
    Integer convocatoria,
    String rating,
    String observaciones
) {}
