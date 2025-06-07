package es.daw2.fct_fct.controlador.vistas;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import es.daw2.fct_fct.modelo.vistas.VistaGruposCiclos;
import es.daw2.fct_fct.servicio.vistas.VistaGruposCiclosService;

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
}
