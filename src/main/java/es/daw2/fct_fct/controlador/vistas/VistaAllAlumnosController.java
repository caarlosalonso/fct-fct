package es.daw2.fct_fct.controlador.vistas;

import es.daw2.fct_fct.modelo.vistas.VistaAllAlumnos;
import es.daw2.fct_fct.servicio.vistas.VistaAllAlumnosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vista-all-alumnos")
public class VistaAllAlumnosController {

    @Autowired
    private VistaAllAlumnosService service;

    @GetMapping("/all")
    public ResponseEntity<?> obtenerTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<VistaAllAlumnos> obtenerPorId(@PathVariable Long userId) {
        return service.buscarPorId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
