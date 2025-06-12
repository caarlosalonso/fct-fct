package es.daw2.fct_fct.controlador.vistas;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import es.daw2.fct_fct.modelo.vistas.VistaGruposCiclos;
import es.daw2.fct_fct.servicio.vistas.VistaGruposCiclosService;
import es.daw2.fct_fct.utils.Role;
import es.daw2.fct_fct.utils.SessionsManager;
import jakarta.servlet.http.HttpServletRequest;

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
        ResponseEntity<?> validationResponse = SessionsManager.isValidSession(request, Role.TUTOR);
        if (validationResponse != null) return validationResponse;

        Long tutorId = (Long) request.getSession().getAttribute("child_id");
        Optional<VistaGruposCiclos> grupoOpt = servicio.getByTutorId(tutorId);

        if (grupoOpt.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(grupoOpt.get());
    }
}
