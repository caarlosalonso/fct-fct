package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Fct;
import es.daw2.fct_fct.servicio.ServicioFCT;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/fct")
public class ControladorFCT extends CrudController<Long, Fct, Fct, Fct, ServicioFCT> {

    @Override
    public ResponseEntity<?> create(@RequestBody Fct dto, HttpServletRequest request) {
        service.save(dto);

        URI location = URI.create("/api/fct/" + dto.getId());

        return ResponseEntity.created(location).body(dto);
    }

    // all ya existe en CrudController

    // getById ya existe en CrudController

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Fct dto, HttpServletRequest request) {
        Optional<Fct> fctOpt = service.getById(id);
        if (!fctOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el FCT con el id: " + id);
        }

        Optional<Fct> fctActualizado = service.update(id, fctOpt.get());
        if (!fctActualizado.isPresent()) {
            return ResponseEntity.badRequest().body("No se ha podido actualizar el FCT con el id: " + id);
        }

        URI location = URI.create("/api/fct/" + id);
        return ResponseEntity.created(location).body(fctActualizado.get());
    }
}
