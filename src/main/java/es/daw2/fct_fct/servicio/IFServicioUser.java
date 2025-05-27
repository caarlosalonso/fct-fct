package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import es.daw2.fct_fct.modelo.User;

public interface IFServicioUser {
    
    public User findByEmailAndPassword(String email, String password);
    public List<User> listaUsers();
    public User addUsers(User u);
    public Optional<User> getUsersId(Long user_id);
    public boolean borrarUsers(Long user_id);
}
