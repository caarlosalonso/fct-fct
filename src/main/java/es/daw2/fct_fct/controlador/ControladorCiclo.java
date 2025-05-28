package es.daw2.fct_fct.controlador;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Ciclo;
import es.daw2.fct_fct.servicio.ServicioCiclo;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/ciclos")
public class ControladorCiclo {
    
    @Autowired
    private ServicioCiclo servicioCiclo;

    @GetMapping("/all")
    public ResponseEntity<?> getAllCiclos() {
        List<Ciclo> ciclos = servicioCiclo.getAllCiclos();
        if (ciclos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(ciclos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCicloById(@PathVariable Long id) {
        Ciclo ciclo = servicioCiclo.getCicloById(id);
        if (ciclo == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ciclo);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createCiclo(@RequestBody Ciclo ciclo) {
        Ciclo nuevoCiclo = servicioCiclo.createCiclo(ciclo);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoCiclo);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCiclo(@PathVariable Long id, @RequestBody Ciclo ciclo) {
        Ciclo cicloActualizado = servicioCiclo.updateCiclo(id, ciclo);
        if (cicloActualizado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cicloActualizado);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCiclo(@PathVariable Long id) {
        servicioCiclo.deleteCiclo(id);
        return ResponseEntity.noContent().build();
    }

}
