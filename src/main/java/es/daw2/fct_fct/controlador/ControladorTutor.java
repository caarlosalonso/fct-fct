package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.dto.CreateAlumnoDTO;
import es.daw2.fct_fct.dto.CreateUserDTO;
import es.daw2.fct_fct.modelo.Alumno;
import es.daw2.fct_fct.modelo.Tutor;
import es.daw2.fct_fct.modelo.User;
import es.daw2.fct_fct.servicio.ServicioAlumno;
import es.daw2.fct_fct.servicio.ServicioTutores;
import es.daw2.fct_fct.servicio.ServicioUser;
import es.daw2.fct_fct.utils.PasswordUtils;
import es.daw2.fct_fct.utils.Role;
import es.daw2.fct_fct.utils.SessionValidation;
import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/api/tutores")
public class ControladorTutor extends CrudController<Long, Tutor, CreateUserDTO, Tutor, ServicioTutores> {

    @Override
    public ResponseEntity<?> create(@RequestBody CreateUserDTO t, HttpServletRequest request) {
        ResponseEntity<?> sessionValidation = SessionValidation.isValidSession(request, Role.COORDINADOR);
        if (sessionValidation != null) return sessionValidation;

        User newUser = new User();
        newUser.setName(t.name());
        newUser.setEmail(t.email());
        newUser.setPassword(
            PasswordUtils.hashPassword(t.password())
        );
        newUser.setRole(Role.TUTOR);

        if (servicioUser.checkEmailExists(newUser.getEmail())) {
            return ResponseEntity.status(409).body("El email ya existe"); // Conflicto, ya existe un usuario con ese email
        }

        User saved = servicioUser.save(newUser);

        Tutor tutor = new Tutor();
        tutor.setUser(saved);
        service.save(tutor);

        URI location = URI.create("/api/tutores/" + tutor.getId());

        return ResponseEntity.created(location).body(tutor);
    }

    // all ya existe en CrudController

    // getById ya existe en CrudController

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Tutor a, HttpServletRequest request){
        Optional<Tutor> optional = service.getById(id);

        if(!optional.isPresent()){
            return ResponseEntity.notFound().build();
        }

        a.setId(id);

        Optional<Tutor> tutorActualizado = service.update(id, a);
        if (!tutorActualizado.isPresent()) {
            return ResponseEntity.badRequest().body("No se ha podido actualizar el tutor con el id: " + id);
        }

        URI location = URI.create("/api/tutores/" + a.getId());

        return ResponseEntity.ok().location(location).body(tutorActualizado);
    }

    // delete ya existe en CrudController

    @Autowired
    private ServicioAlumno servicioAlumnos;
    
    @Autowired
    private ServicioUser servicioUser;

    @PostMapping("/alumno")
    public ResponseEntity<?> crearAlumno(@RequestBody CreateAlumnoDTO dto) {
        User user = new User();
        user.setName(dto.nombre());
        user.setEmail(dto.email());
        user.setPassword(PasswordUtils.hashPassword(dto.dni()));
        user.setRole(Role.ALUMNO);
        user = servicioUser.save(user);

        Alumno nuevoAlumno = new Alumno();
        nuevoAlumno.setUser(user);
        nuevoAlumno.setPhone(dto.phone());
        nuevoAlumno.setNia(dto.nia());
        nuevoAlumno.setDni(dto.dni());
        nuevoAlumno.setNuss(dto.nuss());

        servicioAlumnos.save(nuevoAlumno);


        URI location = URI.create("/api/alumnos/" + nuevoAlumno.getId());
        return ResponseEntity.created(location).body(nuevoAlumno);
    }

    @PutMapping("/resetPassword/{id}")
    public ResponseEntity<?> resetPassword(@PathVariable Long id) {
        Optional<Alumno> optionalAlumno = servicioAlumnos.getById(id);
        if (!optionalAlumno.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Alumno alumno = optionalAlumno.get();
        User user = alumno.getUser();
        user.setPassword(PasswordUtils.hashPassword(
            alumno.getNia()
        ));
        servicioUser.update(user.getId(), user);

        return ResponseEntity.ok("Contraseña actualizada correctamente");
    }

    @GetMapping("/self")
    public ResponseEntity<?> obtenerPorUsuarioActual(HttpServletRequest request) {
        ResponseEntity<?> sessionValidation = SessionValidation.isValidSession(request, Role.TUTOR);
        if (sessionValidation != null) return sessionValidation;

        Long userId = SessionValidation.getUserIdFromSession(request);
        return service.getByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
