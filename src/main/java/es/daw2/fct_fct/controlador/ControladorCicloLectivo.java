package es.daw2.fct_fct.controlador;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.CicloLectivo;
import es.daw2.fct_fct.servicio.ServicioCicloLectivo;


@RestController
@RequestMapping("/api/ciclos-lectivos")
public class ControladorCicloLectivo extends CrudController<Long, CicloLectivo, CicloLectivo, CicloLectivo, ServicioCicloLectivo> {

    @Autowired
    private ServicioCicloLectivo servicioCicloLectivo;

    @Override
    ResponseEntity<?> create(@RequestBody CicloLectivo dto) {
        CicloLectivo nuevoCicloLectivo = servicioCicloLectivo.save(dto);
        return ResponseEntity.ok(nuevoCicloLectivo);
    }

    @Override
    ResponseEntity<?> all() {
        List<CicloLectivo> ciclos = servicioCicloLectivo.list();
        return ResponseEntity.ok(ciclos);
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
