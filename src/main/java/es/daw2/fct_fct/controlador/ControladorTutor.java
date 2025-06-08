package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Tutor;
import es.daw2.fct_fct.servicio.ServicioTutores;
import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/api/tutores")
public class ControladorTutor extends CrudController<Long, Tutor, Tutor, Tutor, ServicioTutores> {

    @Override
    public ResponseEntity<?> create(@RequestBody Tutor t, HttpServletRequest request) {
        service.save(t);

        URI location = URI.create("/api/tutores/" + t.getId());

        return ResponseEntity.created(location).body(t);
    }

    // all ya existe en CrudController

    // getById ya existe en CrudController

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Tutor a, HttpServletRequest request){
        Optional<Tutor> optional = service.getById(id);

        if(!optional.isPresent()){
            return ResponseEntity.notFound().build();
        }

        a.setId(id);

        Optional<Tutor> tutorActualizado = service.update(id, a);
        if (!tutorActualizado.isPresent()) {
            return ResponseEntity.badRequest().body("No se ha podido actualizar el tutor con el id: " + id);
        }

        URI location = URI.create("/api/tutores/" + a.getId());

        return ResponseEntity.ok().location(location).body(tutorActualizado);
    }

    // delete ya existe en CrudController
}
