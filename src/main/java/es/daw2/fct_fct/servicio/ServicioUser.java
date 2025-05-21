package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.Users;
import es.daw2.fct_fct.repositorio.RepositorioUser;
import es.daw2.fct_fct.utils.PasswordUtils;

@Service
public class ServicioUser implements IFServicioUser {

    @Autowired
    RepositorioUser repositorioUser;
    
    @Override
    public Users findByEmailAndPassword(String email, String password) {
        Users loginUser = null;
        for (Users user : repositorioUser.findAll()) {
            if (user.getEmail().equalsIgnoreCase(email)) {
                loginUser = user;
            }
        }

        if (loginUser == null) return null;     // El email no existe
        // El email existe, se verifica la contraseña

        if (PasswordUtils.doPasswordsMatch(password, loginUser.getPassword()))
            return loginUser;   // La contraseña es correcta
        else
            return null;        // La contraseña es incorrecta
    }

    
    @Override
    public List<Users> listaUsers() {
        return (List<Users>) repositorioUser.findAll();
    }

    @Override
    public Users addUsers(Users u) {
        return repositorioUser.save(u);
    }

    @Override
    public Optional<Users> getUsersId(Long id) {
        return repositorioUser.findById(id);
    }

    @Override
    public boolean borrarUsers(Long id){
        Optional<Users> userOptional = repositorioUser.findById(id);

        if(userOptional.isPresent()){
            repositorioUser.delete(userOptional.get());
            return true;
        }
        return false;
    }
}
