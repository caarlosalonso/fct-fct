package es.daw2.fct_fct.dto;

import es.daw2.fct_fct.modelo.User.Role;

public record CoordinadorCreateDTO(String name, String email, Role role, String password) {}
