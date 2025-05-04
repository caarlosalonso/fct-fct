package es.daw2.fct_fct.servicio;

import java.util.List;

import es.daw2.fct_fct.modelo.Users;

public interface InterfaceServicioUser {
    
    public List<Users> findAll();
    public Users findByEmailAndPassword(String email, String password);
}
