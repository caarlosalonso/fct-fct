package es.daw2.fct_fct.controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.servicio.ServicioStats;

@RestController
@RequestMapping("/api/stats")
public class ControladorStats {

    @Autowired
    private ServicioStats servicioStats;

    @GetMapping
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(servicioStats.generateStats());
    }
}
