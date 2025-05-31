package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.dto.LoginRequestDTO;
import es.daw2.fct_fct.dto.UserCreateDTO;
import es.daw2.fct_fct.dto.UserDTO;
import es.daw2.fct_fct.modelo.User;
import es.daw2.fct_fct.servicio.ServicioUser;
import es.daw2.fct_fct.utils.PasswordUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;


@RestController
@RequestMapping("/api/users")
public class ControladorUser extends CrudController<Long, UserCreateDTO, User> {
    
    @Autowired
    private ServicioUser servicioUser;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequestDTO,
                                    HttpServletRequest request) {

        User userFound = servicioUser.findByEmailAndPassword(
            loginRequestDTO.email(),
            loginRequestDTO.password()
        );

        if (userFound == null)
            return ResponseEntity.status(401).body("Invalid credentials");
        
        HttpSession session = request.getSession(false);
        if (session != null) session.invalidate();          // Cierra la sesión anterior si existe

        UserDTO dto = new UserDTO(
            userFound.getId(),
            userFound.getName(),
            userFound.getEmail()
        );

        HttpSession newSession = request.getSession(true);
        newSession.setAttribute("user", dto);
        newSession.setAttribute("role", userFound.getRole());

        return ResponseEntity.ok(dto);
    }

    @Override
    public ResponseEntity<?> create(@RequestBody UserCreateDTO dto) {
        // Map DTO to entity
        User newUser = new User();
        newUser.setName(dto.name());
        newUser.setEmail(dto.email());
        newUser.setPassword(
            PasswordUtils.hashPassword(dto.password())
        );
    /*  No se deberían crear 'users' así porque sí. Si se crea uno, debería ser
        un ADMIN. Así que se debe verificar si los crea un ADMIN. Por ahora,
        solo se permite la creación de ALUMNOS desde el controlador de Users.   */
        newUser.setRole(User.Role.ALUMNO);
        newUser.setUpdatedPasswordAt(null);

        if (servicioUser.checkEmailExists(newUser.getEmail())) {
            return ResponseEntity.status(409).body("Email already exists"); // Conflicto, ya existe un usuario con ese email
        }

        servicioUser.addUsers(newUser);

        UserDTO data = new UserDTO(
            newUser.getId(),
            newUser.getName(),
            newUser.getEmail()
        );

        URI location = URI.create("/api/users/" + newUser.getId());
        return ResponseEntity.created(location).body(data);
    }

    @Override
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Optional<User> users = servicioUser.getUsersId(id);
        if (users.isPresent()) {
            return ResponseEntity.ok(users.get());
        }
        return ResponseEntity.status(404).body("No se encontraron usuarios con el id: " + id); //No me deja poner el notFound()
    }

    @Override
    public ResponseEntity<?> all() {
        Iterable<User> it = servicioUser.listaUsers();

        if (it!=null) {
            return ResponseEntity.ok(it);
        }else{
            return ResponseEntity.badRequest().build();
        }
    }

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody User u){
        Optional<User> optional = servicioUser.getUsersId(id);

        if(!optional.isPresent()){
            return ResponseEntity.notFound().build();
        }

        u.setId(id);

        User userActualizado = servicioUser.addUsers(u);

        URI location = URI.create("/api/users/" +u.getId());

        return ResponseEntity.ok().location(location).body(userActualizado);
    }

    @Override
    public ResponseEntity<?> delete(@PathVariable Long id){
        boolean userBorrado = servicioUser.borrarUsers(id);

        if(userBorrado){
            return ResponseEntity.ok().body("Usuario borrado correctamente");
        }else{
            return ResponseEntity.badRequest().body("No se ha podido borrar el usuario con id: " + id);
        }
    }
}
