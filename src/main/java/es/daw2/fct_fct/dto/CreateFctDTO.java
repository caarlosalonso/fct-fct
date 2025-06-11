package es.daw2.fct_fct.dto;

import java.time.LocalDate;

public record CreateFctDTO(
    Boolean renuncia,
    Long cursoId,
    Long empresaId,
    Long tutorEmpresaId,
    LocalDate fechaInicio,
    Integer horasSemanales,
    Integer noLectivos,
    Integer horasPracticas,
    LocalDate fechaFin,
    String motivoRenuncia
) {}
