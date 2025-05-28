package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Curso;
import es.daw2.fct_fct.servicio.ServicioCurso;


@RestController
@RequestMapping("/api/cursos")
public class ControladorCurso extends CrudController<Long, Curso, Curso> {

    @Autowired
    private ServicioCurso servicioCurso;

    @Override
    public ResponseEntity<?> create(@RequestBody Curso c) {
        servicioCurso.addCurso(c);
        
        URI location = URI.create("/listarCursosId" +c.getId());
        return ResponseEntity.created(location).body(c);
    }

    @Override
    public ResponseEntity<?> all() {
        Iterable<Curso> it = null;
        it = servicioCurso.listaCursos();

        if (it!=null) {
            return ResponseEntity.ok(it);
        }else{
            return ResponseEntity.badRequest().build();
        }
    }

    @Override
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Optional<Curso> curso = servicioCurso.getCursoId(id);

        if (curso.isPresent()) {
            return ResponseEntity.ok(curso.get());
        }else{
            return ResponseEntity.status(404).body("No se encontraron cursos con el id: " + id); //No me deja poner el notFound()
        }
    }

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Curso c) {
        Optional<Curso> optional = servicioCurso.getCursoId(id);

        if (!optional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        c.setId(id);

        Curso cursoActualizado = servicioCurso.addCurso(c);

        URI location = URI.create("/listarCursosId" + c.getId());

        return ResponseEntity.created(location).body(cursoActualizado);
    }

    @Override
    public ResponseEntity<?> delete(@PathVariable Long id) {
        boolean Cursoborrado = servicioCurso.borrarCurso(id);

        if (Cursoborrado) {
            return ResponseEntity.ok("Curso borrado con exito");
        } else {
            return ResponseEntity.status(404).body("No se encontraron cursos con el id: " + id);
        }
    }

}
