package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Alumno;
import es.daw2.fct_fct.servicio.ServicioAlumno;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/api/alumnos")
public class ControladorAlumno extends CrudController<Long, Alumno, Alumno, Alumno, ServicioAlumno> {

    @Override
    public ResponseEntity<?> create(@RequestBody Alumno a) {
        service.save(a);

        URI location = URI.create("/api/alumnos/" + a.getId());

        return ResponseEntity.created(location).body(a);
    }

    // all ya existe en CrudController

    // getById ya existe en CrudController

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Alumno a) {
        Optional<Alumno> optional = service.getById(id);

        if(!optional.isPresent()){
            return ResponseEntity.notFound().build();
        }

        a.setId(id);

        Optional<Alumno> alumnoActualizado = service.update(id, a);
        if (!alumnoActualizado.isPresent()) {
            return ResponseEntity.badRequest().body("No se ha podido actualizar el alumno con el id: " + id);
        }

        URI location = URI.create("/api/alumnos/" + a.getId());

        return ResponseEntity.ok().location(location).body(alumnoActualizado);
    }

    // delete ya existe en CrudController
}
