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

import es.daw2.fct_fct.dto.CreateUserDTO;
import es.daw2.fct_fct.dto.LoginRequestDTO;
import es.daw2.fct_fct.dto.UserCreateDTO;
import es.daw2.fct_fct.dto.UserDTO;
import es.daw2.fct_fct.dto.UserResetPasswordDTO;
import es.daw2.fct_fct.dto.UserResetPasswordTutorDTO;
import es.daw2.fct_fct.modelo.User;
import es.daw2.fct_fct.modelo.User.Role;
import es.daw2.fct_fct.servicio.ServicioAlumno;
import es.daw2.fct_fct.servicio.ServicioCoordinacion;
import es.daw2.fct_fct.servicio.ServicioTutores;
import es.daw2.fct_fct.servicio.ServicioUser;
import es.daw2.fct_fct.utils.PasswordUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;


@RestController
@RequestMapping("/api/users")
public class ControladorUser extends CrudController<Long, User, UserCreateDTO, User, ServicioUser> {

    @Autowired
    private ServicioCoordinacion servicioCoordinacion;
    @Autowired
    private ServicioAlumno servicioAlumno;
    @Autowired
    private ServicioTutores servicioTutores;
    

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequestDTO,
                                    HttpServletRequest request) {

        User userFound = service.findByEmailAndPassword(
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
        newSession.setAttribute("user", userFound.getId());
        newSession.setAttribute("email", userFound.getEmail());
        newSession.setAttribute("role", userFound.getRole());
        newSession.setAttribute("nombre", userFound.getName());
        System.out.println(newSession.getId() + " - " + userFound.getEmail() + " - " + userFound.getName() + " - " + userFound.getRole());

        switch (userFound.getRole()) {
            case User.Role.ADMIN -> newSession.setAttribute("child_id", null);
            case User.Role.COORDINADOR -> servicioCoordinacion.getByUserId(userFound.getId()).ifPresent(coordinacion -> newSession.setAttribute("child_id", coordinacion));
            case User.Role.TUTOR -> servicioTutores.getByUserId(userFound.getId()).ifPresent(tutor -> newSession.setAttribute("child_id", tutor));
            case User.Role.ALUMNO -> servicioAlumno.getByUserId(userFound.getId()).ifPresent(alumno -> newSession.setAttribute("child_id", alumno));
            default -> {
                return ResponseEntity.status(403).body("Forbidden: Invalid user role");
            }
        }

        return ResponseEntity.ok(dto);
    }

    @PostMapping("/reset-password/{id}")
    public ResponseEntity<?> changePassword(@PathVariable Long id,
                                @RequestBody UserResetPasswordTutorDTO entity,
                                HttpServletRequest request) {

    /*  Debemos obligatoriamente revisar la sesión para que no puedan
        cambiar las contraseñas extraños                                        */
        HttpSession session = request.getSession(false);
        if (session == null ||
            session.getAttribute("user") == null ||
            session.getAttribute("role") != "tutor") {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Optional<User> userOptional = service.getById(id);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setPassword(PasswordUtils.hashPassword(entity.newPassword()));
            service.save(user);
            return ResponseEntity.ok("Password updated successfully");
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody UserResetPasswordDTO entity, HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Long id = (Long) session.getAttribute("user");
        
        Object sessionId = session.getAttribute("id");
        if (sessionId == null || !(sessionId instanceof Long) || !((Long) sessionId).equals(id)) {
            return ResponseEntity.status(403).body("Forbidden: You can only change your own password");
        }

        Optional<User> userOptional = service.getById(id);

        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();

        boolean isCurrentPasswordValid = PasswordUtils.doPasswordsMatch(
            entity.currentPassword(),
            user.getPassword()
        );

        if (!isCurrentPasswordValid) {
            return ResponseEntity.badRequest().body("Current password is incorrect");
        }

        if (entity.newPassword() == null || entity.newPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("New password cannot be empty");
        }

        if (!entity.newPassword().equals(entity.confirmPassword())) {
            return ResponseEntity.badRequest().body("New password and confirm password do not match");
        }

        user.setPassword(PasswordUtils.hashPassword(entity.newPassword()));
        service.save(user);
        return ResponseEntity.ok("Password updated successfully");
    }

    @Override
    public ResponseEntity<?> create(@RequestBody UserCreateDTO dto, HttpServletRequest request) {
        // Map DTO to entity
        User newUser = new User();
        newUser.setName(dto.name());
        newUser.setEmail(dto.email());
        newUser.setPassword(
            PasswordUtils.hashPassword(dto.password())
        );
        newUser.setRole(dto.role());

        if (service.checkEmailExists(newUser.getEmail())) {
            return ResponseEntity.status(409).body("Email already exists"); // Conflicto, ya existe un usuario con ese email
        }

        service.save(newUser);

        UserDTO data = new UserDTO(
            newUser.getId(),
            newUser.getName(),
            newUser.getEmail()
        );

        URI location = URI.create("/api/users/" + newUser.getId());
        return ResponseEntity.created(location).body(data);
    }

    // all ya existe en CrudController

    // getById ya existe en CrudController

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody User u, HttpServletRequest request){
        Optional<User> optional = service.getById(id);

        if(!optional.isPresent()){
            return ResponseEntity.notFound().build();
        }

        u.setId(id);

        Optional<User> userActualizado = service.update(id, u);
        if (!userActualizado.isPresent()) {
            return ResponseEntity.badRequest().body("No se ha podido actualizar el usuario con el id: " + id);
        }

        URI location = URI.create("/api/users/" +u.getId());

        return ResponseEntity.ok().location(location).body(userActualizado);
    }

    // delete ya existe en CrudController

    @PostMapping("/admin")
    public ResponseEntity<?> create(@RequestBody CreateUserDTO c, HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return ResponseEntity.status(401).body("Unauthorized");
        Object role = session.getAttribute("role");
        if (role == null || ! role.equals("ADMIN")) {
            return ResponseEntity.status(403).body("Forbidden: Only admins can create coordinators");
        }

        User newUser = new User();
        newUser.setName(c.name());
        newUser.setEmail(c.email());
        newUser.setPassword(
            PasswordUtils.hashPassword(c.password())
        );
        newUser.setRole(Role.ADMIN);

        if (service.checkEmailExists(newUser.getEmail())) {
            return ResponseEntity.status(409).body("Email already exists"); // Conflicto, ya existe un usuario con ese email
        }

        User saved = service.save(newUser);

        URI location = URI.create("/api/user/" + saved.getId());

        return ResponseEntity.created(location).body(saved);
    }
}
