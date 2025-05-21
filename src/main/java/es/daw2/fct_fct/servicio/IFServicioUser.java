package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import es.daw2.fct_fct.modelo.Users;

public interface IFServicioUser {
    
    public Users findByEmailAndPassword(String email, String password);
    public List<Users> listaUsers();
    public Users addUsers(Users u);
    public Optional<Users> getUsersId(Long id);
    public boolean borrarUsers(Long id);
}
