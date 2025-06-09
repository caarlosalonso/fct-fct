package es.daw2.fct_fct.dto;

public record AlumnoCreateDTO(
        String nombreAlumno,
        String email,
        String dni,
        String nia,
        String nuss,
        String phone,
        String address
) {}
