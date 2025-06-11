package es.daw2.fct_fct.controlador.vistas;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import es.daw2.fct_fct.modelo.vistas.VistaAlumnoCiclos;
import es.daw2.fct_fct.servicio.vistas.VistaAlumnoCiclosService;
import es.daw2.fct_fct.utils.Role;
import es.daw2.fct_fct.utils.SessionsManager;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/vista-alumno-ciclos")
public class VistaAlumnoCiclosController {

    @Autowired
    private VistaAlumnoCiclosService service;

    @GetMapping("/all")
    public ResponseEntity<?> obtenerTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{cicloLectivoId}")
    public ResponseEntity<VistaAlumnoCiclos> obtenerPorId(@PathVariable Long cicloLectivoId) {
        return service.buscarPorId(cicloLectivoId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/alumno")
    public ResponseEntity<?> getById(HttpServletRequest request) {
        ResponseEntity<?> validationResponse = SessionsManager.isValidSession(request, Role.ALUMNO);
        if (validationResponse != null) return validationResponse;

        Long alumnoId = (Long) request.getSession().getAttribute("child_id");
        Optional<VistaAlumnoCiclos> alumnoOpt = service.getByALumnoId(alumnoId);

        if (alumnoOpt.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(alumnoOpt.get());
    }
}
