package es.daw2.fct_fct.servicio;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.Users;
import es.daw2.fct_fct.repositorio.RepositorioUser;

@Service
public class ServicioUser implements InterfaceServicioUser {

    @Autowired
    RepositorioUser repositorioUser;

    @Override
    public List<Users> findAll() {
        return (List<Users>) repositorioUser.findAll();
    }
    
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

        // Se debe reemplazar con verificación de contraseñas encriptadas
        if (password.equalsIgnoreCase(loginUser.getPassword()))
            return loginUser;   // La contraseña es correcta
        else
            return null;        // La contraseña es incorrecta
    }
}
