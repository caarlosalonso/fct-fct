package es.daw2.fct_fct.controlador;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Archivo;


@RestController
@RequestMapping("/api/archivos")
public class ControladorArchivo extends CrudController<Long, Archivo, Archivo> {

    @Override
    ResponseEntity<?> create(@RequestBody Archivo dto) {
        // Implementación para crear un Archivo
        throw new UnsupportedOperationException("Create operation is not supported");
    }

    @Override
    ResponseEntity<?> all() {
        // Implementación para obtener todos los Archivos
        throw new UnsupportedOperationException("Get all operation is not supported");
    }

    @Override
    ResponseEntity<?> getById(@PathVariable Long id) {
        // Implementación para obtener un Archivo por ID
        throw new UnsupportedOperationException("Get by ID operation is not supported");
    }

    @Override
    ResponseEntity<?> update(@PathVariable Long id, @RequestBody Archivo dto) {
        // Implementación para actualizar un Archivo
        throw new UnsupportedOperationException("Update operation is not supported");
    }

    @Override
    ResponseEntity<?> delete(@PathVariable Long id) {
        // Implementación para eliminar un Archivo
        throw new UnsupportedOperationException("Delete operation is not supported");
    }
}