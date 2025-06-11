package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.dto.AlumnoActualizarDTO;
import es.daw2.fct_fct.dto.AlumnoCreateDTO;
import es.daw2.fct_fct.modelo.Alumno;
import es.daw2.fct_fct.modelo.User;
import es.daw2.fct_fct.servicio.ServicioAlumno;
import es.daw2.fct_fct.servicio.ServicioUser;
import es.daw2.fct_fct.utils.PasswordUtils;
import es.daw2.fct_fct.utils.Role;
import es.daw2.fct_fct.utils.SessionValidation;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/api/alumnos")
public class ControladorAlumno extends CrudController<Long, Alumno, AlumnoCreateDTO, AlumnoActualizarDTO, ServicioAlumno> {

    @Autowired
    private ServicioUser servicioUser;

    @Override
    public ResponseEntity<?> create(@RequestBody AlumnoCreateDTO a, HttpServletRequest request) {
        ResponseEntity<?> sessionValidation = SessionValidation.isValidSession(request, Role.TUTOR);
        if (sessionValidation != null) return sessionValidation;

        User newUser = new User();
        newUser.setName(a.nombreAlumno());
        newUser.setEmail(a.email());
        newUser.setPassword(
            PasswordUtils.hashPassword(a.nia())
        );
        newUser.setRole(Role.ALUMNO);

        if (servicioUser.checkEmailExists(newUser.getEmail())) {
            return ResponseEntity.status(409).body("El email ya existe"); // Conflicto, ya existe un usuario con ese email
        }

        User saved = servicioUser.save(newUser);

        Alumno nuevoAlumno = new Alumno();

        nuevoAlumno.setDni(a.dni());
        nuevoAlumno.setNia(a.nia());
        nuevoAlumno.setNuss(a.nuss());
        nuevoAlumno.setPhone(a.phone());
        nuevoAlumno.setAddress(a.address());
        nuevoAlumno.setConvocatoria(a.convocatoria() == null ? 3 : a.convocatoria());
        nuevoAlumno.setUser(saved);

        nuevoAlumno = service.save(nuevoAlumno);
        URI location = URI.create("/api/alumnos/" + nuevoAlumno.getId());
        return ResponseEntity.created(location).body(nuevoAlumno);
    }

    // all ya existe en CrudController

    // getById ya existe en CrudController

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody AlumnoActualizarDTO a, HttpServletRequest request) {
        Optional<Alumno> optional = service.getById(id);

        if(!optional.isPresent()){
            return ResponseEntity.notFound().build();
        }

        Alumno alumno = optional.get();

        alumno.getUser().setName(a.name());
        alumno.getUser().setEmail(a.email());
        servicioUser.update(alumno.getUser().getId(), alumno.getUser());

        alumno.setPhone(a.phone());
        alumno.setNia(a.nia());
        alumno.setDni(a.dni());
        alumno.setNuss(a.nuss());
        alumno.setAddress(a.address());
        alumno.setConvocatoria(a.convocatoria() == null ? 3 : a.convocatoria());

        Optional<Alumno> alumnoActualizado = service.update(id, alumno);
        if (!alumnoActualizado.isPresent()) {
            return ResponseEntity.badRequest().body("No se ha podido actualizar el alumno con el id: " + id);
        }

        URI location = URI.create("/api/alumnos/" + id);

        return ResponseEntity.ok().location(location).body(alumnoActualizado);
    }

    // delete ya existe en CrudController

    @GetMapping("/self")
    public ResponseEntity<?> obtenerPorUsuarioActual(HttpServletRequest request) {
        ResponseEntity<?> sessionValidation = SessionValidation.isValidSession(request, Role.ALUMNO);
        if (sessionValidation != null) return sessionValidation;

        Long userId = SessionValidation.getUserIdFromSession(request);
        return service.getByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
