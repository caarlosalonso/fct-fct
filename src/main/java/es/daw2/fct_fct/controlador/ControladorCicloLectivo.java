package es.daw2.fct_fct.controlador;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.CicloLectivo;


@RestController
@RequestMapping("/api/ciclos-lectivos")
public class ControladorCicloLectivo extends CrudController<Long, CicloLectivo, CicloLectivo> {

    @Override
    ResponseEntity<?> create(@RequestBody CicloLectivo dto) {
        // Implementación para crear un Ciclo Lectivo
        throw new UnsupportedOperationException("Create operation is not supported");
    }

    @Override
    ResponseEntity<?> all() {
        // Implementación para obtener todos los Ciclos Lectivos
        throw new UnsupportedOperationException("Get all operation is not supported");
    }

    @Override
    ResponseEntity<?> getById(@PathVariable Long id) {
        // Implementación para obtener un Ciclo Lectivo por ID
        throw new UnsupportedOperationException("Get by ID operation is not supported");
    }

    @Override
    ResponseEntity<?> update(@PathVariable Long id, @RequestBody CicloLectivo dto) {
        // Implementación para actualizar un Ciclo Lectivo
        throw new UnsupportedOperationException("Update operation is not supported");
    }

    @Override
    ResponseEntity<?> delete(@PathVariable Long id) {
        // Implementación para eliminar un Ciclo Lectivo
        throw new UnsupportedOperationException("Delete operation is not supported");
    }
}
