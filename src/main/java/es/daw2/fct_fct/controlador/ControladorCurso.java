package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Curso;
import es.daw2.fct_fct.servicio.ServicioCurso;


@RestController
@RequestMapping("/api/cursos")
public class ControladorCurso extends CrudController<Long, Curso, Curso, Curso, ServicioCurso> {

    @Override
    public ResponseEntity<?> create(@RequestBody Curso c) {
        service.save(c);
        
        URI location = URI.create("/listarCursosId" +c.getId());
        return ResponseEntity.created(location).body(c);
    }

    // all ya existe en CrudController

    // getById ya existe en CrudController

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Curso c) {
        Optional<Curso> optional = service.getById(id);

        if (!optional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        c.setId(id);

        Optional<Curso> cursoActualizado = service.update(id, c);
        if (!cursoActualizado.isPresent()) {
            return ResponseEntity.badRequest().body("No se ha podido actualizar el curso con el id: " + id);
        }

        URI location = URI.create("/listarCursosId" + c.getId());

        return ResponseEntity.created(location).body(cursoActualizado);
    }

    // delete ya existe en CrudController
}
