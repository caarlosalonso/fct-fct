package es.daw2.fct_fct.controlador.vistas;

import es.daw2.fct_fct.modelo.vistas.VistaEmpresaTutor;
import es.daw2.fct_fct.servicio.vistas.VistaEmpresaTutorService;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vista-empresas-tutores")
public class VistaEmpresaTutorController {

    @Autowired
    private VistaEmpresaTutorService service;

    @GetMapping("/all")
    public ResponseEntity<?> obtenerTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{empresaId}")
    public ResponseEntity<VistaEmpresaTutor> obtenerPorId(@PathVariable Long empresaId) {
        return service.buscarPorId(empresaId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
