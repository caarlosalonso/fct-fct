package es.daw2.fct_fct.controlador;

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

    @Override
    ResponseEntity<?> create(@RequestBody CicloLectivo dto) {
        CicloLectivo nuevoCicloLectivo = service.save(dto);
        return ResponseEntity.ok(nuevoCicloLectivo);
    }

    // all ya existe en CrudController

    // getById ya existe en CrudController

    @Override
    ResponseEntity<?> update(@PathVariable Long id, @RequestBody CicloLectivo dto) {
        // Implementación para actualizar un Ciclo Lectivo
        throw new UnsupportedOperationException("Update operation is not supported");
    }

    // delete ya existe en CrudController
}
