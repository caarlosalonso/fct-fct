package es.daw2.fct_fct.dto;

import java.util.Arrays;

import es.daw2.fct_fct.modelo.User.Role;

public record UserCreateDTO(String name, String email, Role role, String password) {

    public UserCreateDTO {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name cannot be null or blank");
        }
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email cannot be null or blank");
        }
        if (role == null || ! Arrays.asList(Role.values()).contains(role)) {
            throw new IllegalArgumentException("Role must be one of: " + Arrays.toString(Role.values()));
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password cannot be null or blank");
        }
    }
}
