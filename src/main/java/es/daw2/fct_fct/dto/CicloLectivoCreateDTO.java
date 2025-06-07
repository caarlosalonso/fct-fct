package es.daw2.fct_fct.dto;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;

public record CicloLectivoCreateDTO(String nombre, @JsonFormat(pattern = "yyyy-MM-dd") LocalDate fechaInicio) {}
