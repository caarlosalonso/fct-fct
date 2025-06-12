package es.daw2.fct_fct.controlador.vistas;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import es.daw2.fct_fct.modelo.vistas.VistaTutoresCicloLectivo;
import es.daw2.fct_fct.servicio.vistas.VistaTutoresCicloLectivoService;

@RestController
@RequestMapping("/api/vista-tutores-ciclo-lectivo")
public class VistaTutoresCicloLectivoController {

    @Autowired
    private VistaTutoresCicloLectivoService service;

    @GetMapping("/all")
    public ResponseEntity<?> obtenerTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<VistaTutoresCicloLectivo> obtenerPorId(@PathVariable Long userId) {
        return service.buscarPorId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
