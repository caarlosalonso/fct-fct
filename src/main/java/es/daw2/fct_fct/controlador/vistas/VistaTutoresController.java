package es.daw2.fct_fct.controlador.vistas;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import es.daw2.fct_fct.modelo.vistas.VistaTutores;
import es.daw2.fct_fct.servicio.vistas.VistaTutoresService;
import es.daw2.fct_fct.utils.Role;
import es.daw2.fct_fct.utils.SessionsManager;
import jakarta.servlet.http.HttpServletRequest;

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
        ResponseEntity<?> validationResponse = SessionsManager.isValidSession(request, Role.COORDINADOR);
        if (validationResponse != null) return validationResponse;

        List<VistaTutores> tutoresDisponibles = servicio.getTutoresSinGrupoEnCicloLectivo(cicloId);
        return ResponseEntity.ok(tutoresDisponibles);
    }
}
