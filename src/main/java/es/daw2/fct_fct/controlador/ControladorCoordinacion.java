package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Coordinacion;
import es.daw2.fct_fct.modelo.User;
import es.daw2.fct_fct.modelo.User.Role;
import es.daw2.fct_fct.servicio.ServicioCoordinacion;
import es.daw2.fct_fct.servicio.ServicioUser;
import es.daw2.fct_fct.utils.PasswordUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.RequestMapping;

import es.daw2.fct_fct.dto.CoordinadorCreateDTO;


@RestController
@RequestMapping("/api/coordinacion")
public class ControladorCoordinacion extends CrudController<Long, Coordinacion, CoordinadorCreateDTO, Coordinacion, ServicioCoordinacion> {

    @Autowired
    private ServicioUser servicioUser;

    @Override
    public ResponseEntity<?> create(@RequestBody CoordinadorCreateDTO c, HttpServletRequest request) {
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
        newUser.setRole(c.role());

        if (servicioUser.checkEmailExists(newUser.getEmail())) {
            return ResponseEntity.status(409).body("Email already exists"); // Conflicto, ya existe un usuario con ese email
        }

        User saved = servicioUser.save(newUser);

        if (! c.role().equals(Role.COORDINADOR)) {
            URI location = URI.create("/api/users/" + saved.getId());
            return ResponseEntity.created(location).body(saved);
        }

        Coordinacion coordinacion = new Coordinacion();
        coordinacion.setUser(saved);
        service.save(coordinacion);

        URI location = URI.create("/api/coordinacion/" + coordinacion.getId());

        return ResponseEntity.created(location).body(coordinacion);
    }
    

    // all ya existe en CrudController

    // getById ya existe en CrudController

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Coordinacion c, HttpServletRequest request){
        Optional<Coordinacion> optional = service.getById(id);

        if(!optional.isPresent()){
            return ResponseEntity.notFound().build();
        }

        c.setId(id);

        Optional<Coordinacion> coordinacionActualizado = service.update(id, c);
        if (!coordinacionActualizado.isPresent()) {
            return ResponseEntity.badRequest().body("No se ha podido actualizar coordinación con el id: " + id);
        }

        URI location = URI.create("/api/coordinacion/" +c.getId());

        return ResponseEntity.ok().location(location).body(coordinacionActualizado);
    }

    // delete ya existe en CrudController
}
