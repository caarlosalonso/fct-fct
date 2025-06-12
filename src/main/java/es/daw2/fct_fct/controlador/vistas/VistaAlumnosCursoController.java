package es.daw2.fct_fct.controlador.vistas;

import es.daw2.fct_fct.modelo.vistas.VistaAlumnosCurso;
import es.daw2.fct_fct.servicio.vistas.VistaAlumnosCursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vista-alumnos-curso")
public class VistaAlumnosCursoController {

    @Autowired
    private VistaAlumnosCursoService service;

    @GetMapping("/all")
    public ResponseEntity<?> obtenerTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<VistaAlumnosCurso> obtenerPorId(@PathVariable Long userId) {
        return service.buscarPorId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
