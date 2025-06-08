package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.TutorEmpresa;
import es.daw2.fct_fct.servicio.ServicioTutorEmpresa;
import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/api/tutor-empresa")
public class ControladorTutorEmpresa extends CrudController<Long, TutorEmpresa, TutorEmpresa, TutorEmpresa, ServicioTutorEmpresa> {

    @Override
    public ResponseEntity<?> create(@RequestBody TutorEmpresa t, HttpServletRequest request) {
        service.save(t);

        URI location = URI.create("/api/tutor-empresa/" + t.getId());

        return ResponseEntity.created(location).body(t);
    }

    // all ya existe en CrudController

    // getById ya existe en CrudController

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody TutorEmpresa t, HttpServletRequest request) {
        Optional<TutorEmpresa> tutorEmpresa = service.getById(id);

        if (!tutorEmpresa.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        t.setId(id);

        Optional<TutorEmpresa> tutorActualizado = service.update(id, t);
        if (!tutorActualizado.isPresent()) {
            return ResponseEntity.badRequest().body("No se ha podido actualizar el tutor con el id: " + id);
        }

        URI location = URI.create("/api/tutor-empresa/" + t.getId());

        return ResponseEntity.ok().location(location).body(tutorActualizado);
    }

    // delete ya existe en CrudController
}
