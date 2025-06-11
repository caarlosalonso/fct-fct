package es.daw2.fct_fct.utils;

public enum Role {
    ADMIN("Administrador"),
    TUTOR("Tutor"),
    COORDINADOR("Coordinador"),
    ALUMNO("Alumno");

    private final String roleName;
    Role(String roleName) {
        this.roleName = roleName;
    }

    public String getRoleName() {
        return roleName;
    }
}
