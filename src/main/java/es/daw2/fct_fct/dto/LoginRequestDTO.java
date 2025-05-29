package es.daw2.fct_fct.dto;

public record LoginRequestDTO(String email, String password) {

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}
