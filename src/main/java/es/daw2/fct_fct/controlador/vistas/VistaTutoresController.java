package es.daw2.fct_fct.controlador.vistas;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import es.daw2.fct_fct.modelo.User.Role;
import es.daw2.fct_fct.modelo.vistas.VistaTutores;
import es.daw2.fct_fct.servicio.vistas.VistaTutoresService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/vista-tutores")
public class VistaTutoresController {

    @Autowired
    private VistaTutoresService servicio;

    @GetMapping("/all")
    public ResponseEntity<?> all() {
        return ResponseEntity.ok(servicio.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        VistaTutores tutor = servicio.obtenerPorId(id);
        return (tutor != null) ? ResponseEntity.ok(tutor) : ResponseEntity.notFound().build();
    }

    @GetMapping("/disponibles/{cicloId}")
    public ResponseEntity<?> obtenerTutoresSinGrupo(@PathVariable Long cicloId, HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return ResponseEntity.status(401).body("No autorizado");
        Object role = session.getAttribute("role");
        if (role == null || ! role.equals(Role.COORDINADOR)) {
            return ResponseEntity.status(403).body("Forbidden: Sólo los coordinadores pueden ver tutores sin grupo");
        }

        List<VistaTutores> tutoresDisponibles = servicio.getTutoresSinGrupoEnCicloLectivo(cicloId);
        return ResponseEntity.ok(tutoresDisponibles);
    }
}
