package es.daw2.fct_fct.servicio;

import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.User;
import es.daw2.fct_fct.repositorio.RepositorioUser;
import es.daw2.fct_fct.utils.PasswordUtils;


@Service
public class ServicioUser extends AbstractService<Long, User, RepositorioUser> {

    public User findByEmailAndPassword(String email, String password) {
        User loginUser = null;
        for (User user : repository.findAll()) {
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

    public boolean checkEmailExists(String email) {
        return repository.findByEmail(email).isPresent();
    }
}
