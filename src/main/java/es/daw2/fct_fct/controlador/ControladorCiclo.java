package es.daw2.fct_fct.controlador;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Ciclo;
import es.daw2.fct_fct.servicio.ServicioCiclo;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/ciclos")
public class ControladorCiclo extends CrudController<Long, Ciclo, Ciclo> {
    
    @Autowired
    private ServicioCiclo servicioCiclo;

    @Override
    public ResponseEntity<?> all() {
        List<Ciclo> ciclos = servicioCiclo.getAllCiclos();
        if (ciclos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(ciclos);
    }

    @Override
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Ciclo ciclo = servicioCiclo.getCicloById(id);
        if (ciclo == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ciclo);
    }

    @Override
    public ResponseEntity<?> create(@RequestBody Ciclo ciclo) {
        Ciclo nuevoCiclo = servicioCiclo.createCiclo(ciclo);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoCiclo);
    }

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Ciclo ciclo) {
        Ciclo cicloActualizado = servicioCiclo.updateCiclo(id, ciclo);
        if (cicloActualizado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cicloActualizado);
    }

    @Override
    public ResponseEntity<?> delete(@PathVariable Long id) {
        servicioCiclo.deleteCiclo(id);
        return ResponseEntity.noContent().build();
    }

}
