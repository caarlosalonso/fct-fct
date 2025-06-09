package es.daw2.fct_fct.controlador.vistas;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import es.daw2.fct_fct.modelo.User.Role;
import es.daw2.fct_fct.modelo.vistas.VistaGruposCiclos;
import es.daw2.fct_fct.servicio.vistas.VistaGruposCiclosService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/vista-grupos-ciclos")
public class VistaGruposCiclosController {

    @Autowired
    private VistaGruposCiclosService servicio;

    @GetMapping("/all")
    public ResponseEntity<?> all() {
        return ResponseEntity.ok(servicio.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        VistaGruposCiclos gruposCiclos = servicio.obtenerPorId(id);
        return (gruposCiclos != null) ? ResponseEntity.ok(gruposCiclos) : ResponseEntity.notFound().build();
    }

    @GetMapping("/tutor")
    public ResponseEntity<?> getById(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return ResponseEntity.status(401).body("No autorizado");
        Object role = session.getAttribute("role");
        if (role == null || ! role.equals(Role.TUTOR)) {
            return ResponseEntity.status(403).body("Forbidden: Sólo los tutores pueden ver el ciclo lectivo actual");
        }

        Long tutorId = (Long) session.getAttribute("user");
        System.out.println("Session ID: " + tutorId);
        Optional<VistaGruposCiclos> grupoOpt = servicio.getByTutorId(tutorId);

        if (grupoOpt.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(grupoOpt.get());
    }
}
