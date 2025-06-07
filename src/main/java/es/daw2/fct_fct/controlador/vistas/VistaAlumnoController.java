package es.daw2.fct_fct.controlador.vistas;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import es.daw2.fct_fct.modelo.vistas.VistaAlumno;
import es.daw2.fct_fct.servicio.vistas.VistaAlumnoService;

@RestController
@RequestMapping("/api/vista-alumnos")
public class VistaAlumnoController {

    @Autowired
    private VistaAlumnoService servicio;

    @GetMapping("/all")
    public ResponseEntity<?> all() {
        return ResponseEntity.ok(servicio.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        VistaAlumno alumno = servicio.obtenerPorId(id);
        return (alumno != null) ? ResponseEntity.ok(alumno) : ResponseEntity.notFound().build();
    }
}
