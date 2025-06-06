package es.daw2.fct_fct.controlador;

import java.util.List;
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

    @Override
    public ResponseEntity<?> all() {
        List<Ciclo> ciclos = service.list();
        if (ciclos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(ciclos);
    }

    @Override
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Optional<Ciclo> ciclo = service.getById(id);
        if (!ciclo.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ciclo.get());
    }

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

    @Override
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

}
