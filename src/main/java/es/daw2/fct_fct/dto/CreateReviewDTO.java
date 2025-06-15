package es.daw2.fct_fct.dto;

public record CreateReviewDTO(
    Long empresaId,
    int puntuacion,
    String comentario
) {}
