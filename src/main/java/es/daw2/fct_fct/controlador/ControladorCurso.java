package es.daw2.fct_fct.controlador;
/* 
import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Curso;
import es.daw2.fct_fct.servicio.ServicioCurso;

@RestController
public class ControladorCurso {

    @Autowired
    private ServicioCurso servicioCurso;

    //Crud
    @PostMapping("/addCurso")
    public ResponseEntity<?> crearCurso(@RequestBody Curso c) {
        servicioCurso.addCurso(c);
        
        URI location = URI.create("/listarCursosId" +c.getId());
        return ResponseEntity.created(location).body(c);
    }

    //cRud
    @GetMapping("/listarCursos")
    public ResponseEntity<?> listaCursos() {
        Iterable<Curso> it = null;
        it = servicioCurso.listaCursos();

        if (it!=null) {
            return ResponseEntity.ok(it);
        }else{
            return ResponseEntity.badRequest().build();
        }
    }

    //cRud
    @GetMapping("/cursos/{id}")
    public ResponseEntity<?> listaCursosId(@PathVariable Long id) {
        Optional<Curso> curso = servicioCurso.getCursoId(id);

        if (curso.isPresent()) {
            return ResponseEntity.ok(curso.get());
        }else{
            return ResponseEntity.status(404).body("No se encontraron cursos con el id: " + id); //No me deja poner el notFound()
        }
    }

    //crUd
    @PostMapping("/actualizarCurso/{id}")
    public ResponseEntity<?> modificarCurso(@PathVariable Long id, @RequestBody Curso c) {
        Optional<Curso> optional = servicioCurso.getCursoId(id);

        if (!optional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        c.setId(id);

        Curso cursoActualizado = servicioCurso.addCurso(c);

        URI location = URI.create("/listarCursosId" + c.getId());

        return ResponseEntity.created(location).body(cursoActualizado);
    }

    //cRuD
    @DeleteMapping("/borrarCurso/{id}")
    public ResponseEntity<?> borrarCurso(@PathVariable Long id) {
        boolean Cursoborrado = servicioCurso.borrarCurso(id);

        if (Cursoborrado) {
            return ResponseEntity.ok("Curso borrado con exito");
        } else {
            return ResponseEntity.status(404).body("No se encontraron cursos con el id: " + id);
        }
    }

}
*/