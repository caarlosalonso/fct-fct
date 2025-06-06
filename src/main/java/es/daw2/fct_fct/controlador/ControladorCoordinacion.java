package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Coordinacion;
import es.daw2.fct_fct.servicio.ServicioCoordinacion;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/api/coordinacion")
public class ControladorCoordinacion extends CrudController<Long, Coordinacion, Coordinacion, Coordinacion, ServicioCoordinacion> {

    @Override
    public ResponseEntity<?> create(@RequestBody Coordinacion c) {
        service.save(c);

        URI location = URI.create("/api/coordinacion/" +c.getId());

        return ResponseEntity.created(location).body(c);
    }
    

    // all ya existe en CrudController

    // getById ya existe en CrudController

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Coordinacion c){
        Optional<Coordinacion> optional = service.getById(id);

        if(!optional.isPresent()){
            return ResponseEntity.notFound().build();
        }

        c.setId(id);

        Optional<Coordinacion> coordinacionActualizado = service.update(id, c);
        if (!coordinacionActualizado.isPresent()) {
            return ResponseEntity.badRequest().body("No se ha podido actualizar coordinación con el id: " + id);
        }

        URI location = URI.create("/api/coordinacion/" +c.getId());

        return ResponseEntity.ok().location(location).body(coordinacionActualizado);
    }

    // delete ya existe en CrudController
}
