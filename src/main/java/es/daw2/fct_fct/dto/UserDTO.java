package es.daw2.fct_fct.dto;

/**
 * Data Transfer Object for User entity.
 * This class is used to transfer user data between the server and client
 * without exposing valuable information.
 */
public record UserDTO(Long id, String name, String email, boolean isAdmin) {}
