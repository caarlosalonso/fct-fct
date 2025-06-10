package es.daw2.fct_fct.controlador.vistas;

import es.daw2.fct_fct.modelo.vistas.VistaEmpresasPlazas;
import es.daw2.fct_fct.servicio.vistas.VistaEmpresasPlazasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vista-empresas-plazas")
public class VistaEmpresasPlazasController {

    @Autowired
    private VistaEmpresasPlazasService service;

    @GetMapping("/all")
    public ResponseEntity<?> obtenerTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{empresaId}")
    public ResponseEntity<VistaEmpresasPlazas> obtenerPorId(@PathVariable Long empresaId) {
        return service.buscarPorId(empresaId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
