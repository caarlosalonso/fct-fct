package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Tutor_empresa;
import es.daw2.fct_fct.servicio.ServicioTutor_Empresa;


@RestController
@RequestMapping("/api/tutor_empresa")
public class ControladorTutor_Empresa extends CrudController<Long, Tutor_empresa, Tutor_empresa, Tutor_empresa, ServicioTutor_Empresa> {

    @Override
    public ResponseEntity<?> create(@RequestBody Tutor_empresa t) {
        service.save(t);

        URI location = URI.create("/api/tutor_empresa/" + t.getId());

        return ResponseEntity.created(location).body(t);
    }

    // all ya existe en CrudController

    // getById ya existe en CrudController

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Tutor_empresa t) {
        Optional<Tutor_empresa> tutor_empresa = service.getById(id);

        if (!tutor_empresa.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        t.setId(id);

        Optional<Tutor_empresa> tutorActualizado = service.update(id, t);
        if (!tutorActualizado.isPresent()) {
            return ResponseEntity.badRequest().body("No se ha podido actualizar el tutor con el id: " + id);
        }

        URI location = URI.create("/api/tutor_empresa/" + t.getId());

        return ResponseEntity.ok().location(location).body(tutorActualizado);
    }

    // delete ya existe en CrudController
}
