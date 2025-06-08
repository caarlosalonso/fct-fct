package es.daw2.fct_fct.controlador.vistas;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import es.daw2.fct_fct.modelo.vistas.VistaCoordinadores;
import es.daw2.fct_fct.servicio.vistas.VistaCoordinadoresService;

@RestController
@RequestMapping("/api/vista-coordinadores")
public class VistaCoordinadoresController {

    @Autowired
    private VistaCoordinadoresService servicio;

    @GetMapping("/all")
    public ResponseEntity<?> all() {
        return ResponseEntity.ok(servicio.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        VistaCoordinadores coordinador = servicio.obtenerPorId(id);
        return (coordinador != null) ? ResponseEntity.ok(coordinador) : ResponseEntity.notFound().build();
    }
}
