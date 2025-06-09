package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.dto.AlumnoGrupoDTO;
import es.daw2.fct_fct.modelo.Alumno;
import es.daw2.fct_fct.modelo.Curso;
import es.daw2.fct_fct.modelo.Grupo;
import es.daw2.fct_fct.servicio.ServicioAlumno;
import es.daw2.fct_fct.servicio.ServicioCurso;
import es.daw2.fct_fct.servicio.ServicioGrupo;
import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/api/cursos")
public class ControladorCurso extends CrudController<Long, Curso, Curso, Curso, ServicioCurso> {

    @Override
    public ResponseEntity<?> create(@RequestBody Curso c, HttpServletRequest request) {
        service.save(c);
        
        URI location = URI.create("/listarCursosId" +c.getId());
        return ResponseEntity.created(location).body(c);
    }

    @Autowired
    private ServicioGrupo servicioGrupo;
    @Autowired
    private ServicioAlumno servicioAlumno;

    @PostMapping("/alumno")
    public ResponseEntity<?> addAlumnoToGrupo(@RequestBody AlumnoGrupoDTO dto, HttpServletRequest request) {
        Optional<Grupo> grupoOpt = servicioGrupo.getById(dto.idGrupo());
        if (grupoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Grupo grupo = grupoOpt.get();

        Optional<Alumno> alumnoOpt = servicioAlumno.getById(dto.idAlumno());
        if (alumnoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Alumno alumno = alumnoOpt.get();

        if (service.checkIfExistsByGrupoAndAlumno(dto.idGrupo(), dto.idAlumno())) {
            return ResponseEntity.badRequest().body("El alumno ya está asignado a este grupo.");
        }

        Curso curso = new Curso();
        curso.setGrupo(grupo);
        curso.setAlumno(alumno);
        curso.setHorasHechas((short) 0);
        curso.setRating("Verde");
        curso.setObservaciones("");

        service.save(curso);
        return ResponseEntity.ok(grupo);
    }

    // all ya existe en CrudController

    // getById ya existe en CrudController

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Curso c, HttpServletRequest request) {
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

    @DeleteMapping("/delete")
    ResponseEntity<?> delete(@RequestBody AlumnoGrupoDTO dto, HttpServletRequest request) {
        Optional<Grupo> grupoOpt = servicioGrupo.getById(dto.idGrupo());
        if (grupoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Alumno> alumnoOpt = servicioAlumno.getById(dto.idAlumno());
        if (alumnoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Long id = service.getIdByGrupoAndAlumno(dto.idGrupo(), dto.idAlumno());

        boolean deleted = service.delete(id);
        if (!deleted) return ResponseEntity.badRequest().body("No se ha podido eliminar el recurso con el id: " + id);
        return ResponseEntity.noContent().build();
    }
}
