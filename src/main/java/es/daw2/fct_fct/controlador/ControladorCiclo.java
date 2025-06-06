package es.daw2.fct_fct.controlador;

import java.util.Optional;

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
public class ControladorCiclo extends CrudController<Long, Ciclo, Ciclo, Ciclo, ServicioCiclo> {

    // all ya existe en CrudController

    // getById ya existe en CrudController

    @Override
    public ResponseEntity<?> create(@RequestBody Ciclo ciclo) {
        Ciclo nuevoCiclo = service.save(ciclo);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoCiclo);
    }

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Ciclo ciclo) {
        Optional<Ciclo> cicloActualizado = service.update(id, ciclo);
        if (!cicloActualizado.isPresent()) {
            return ResponseEntity.badRequest().body("No se ha podido actualizar el ciclo con el id: " + id);
        }
        return ResponseEntity.ok(cicloActualizado.get());
    }

    // delete ya existe en CrudController
}
