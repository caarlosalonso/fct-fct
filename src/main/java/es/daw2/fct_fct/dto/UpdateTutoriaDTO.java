package es.daw2.fct_fct.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

public record UpdateTutoriaDTO(
    @JsonFormat(pattern = "dd'/'MM'/'yyyy', 'HH:mm:ss") LocalDateTime fecha
) {}
