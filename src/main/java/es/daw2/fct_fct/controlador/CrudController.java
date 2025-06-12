package es.daw2.fct_fct.controlador;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import es.daw2.fct_fct.servicio.AbstractService;
import jakarta.servlet.http.HttpServletRequest;

/**
 * Abstract controller for CRUD operations.
 * Contains the basic structure for creation, grouped retrieval, singular retrieval, updating, and deletion of resources.
 * Has 3 generic types:
 * - Id: Type of the identifier type for the resource.
 * - T: Type of the DTO/Object for the resource.
 * - C: Type of the DTO/Object for creation.
 * - U: Type of the DTO/Object for updating.
 * - S: Type of the service that extends AbstractService.
 */
public abstract class CrudController<Id, T, C, U, S extends AbstractService<Id, T, ? extends CrudRepository<T, Id>>> {

    @Autowired
    protected S service;
    
    // Crud
    @PostMapping("/create")
    ResponseEntity<?> create(@RequestBody C dto, HttpServletRequest request) throws UnsupportedOperationException {
        throw new UnsupportedOperationException("Create operation is not supported");
    }

    // cRud
    @GetMapping("/all")
    ResponseEntity<?> all(HttpServletRequest request) {
        List<T> items = service.list();
        if (items == null) return ResponseEntity.badRequest().build();
        if (items.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(items);
    }

    // cRud
    @GetMapping("/{id}")
    ResponseEntity<?> getById(@PathVariable Id id, HttpServletRequest request) {
        Optional<T> item = service.getById(id);
        if (!item.isPresent()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(item.get());
    }

    // crUd
    @PutMapping("/{id}")
    ResponseEntity<?> update(@PathVariable Id id, @RequestBody U dto, HttpServletRequest request) throws UnsupportedOperationException {
        throw new UnsupportedOperationException("Update operation is not supported");
    }

    // cruD
    @DeleteMapping("/{id}")
    ResponseEntity<?> delete(@PathVariable Id id, HttpServletRequest request) {
        boolean deleted = service.delete(id);
        if (!deleted) return ResponseEntity.badRequest().body("No se ha podido eliminar el recurso con el id: " + id);
        return ResponseEntity.noContent().build();
    }
}
