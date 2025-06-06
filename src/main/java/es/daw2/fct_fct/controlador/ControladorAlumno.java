package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Alumno;
import es.daw2.fct_fct.servicio.ServicioAlumno;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/api/alumnos")
public class ControladorAlumno extends CrudController<Long, Alumno, Alumno> {

    @Autowired
    private ServicioAlumno servicioAlumno;

    @Override
    public ResponseEntity<?> create(@RequestBody Alumno a) {
        servicioAlumno.save(a);

        URI location = URI.create("/api/alumnos/" + a.getId());

        return ResponseEntity.created(location).body(a);
    }

    @Override
    public ResponseEntity<?> all() {
        Iterable<Alumno> it = null;
        it = servicioAlumno.list();

        if (it!=null) {
            return ResponseEntity.ok(it);
        }else{
            return ResponseEntity.badRequest().build();
        }
    }

    @Override
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Optional<Alumno> alumnos = servicioAlumno.getById(id);

        if (alumnos.isPresent()) {
            return ResponseEntity.ok(alumnos.get());
        }else{
            return ResponseEntity.status(404).body("No se encontraron alumnos con el id: " + id); //No me deja poner el notFound()
        }
    }

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Alumno a) {
        Optional<Alumno> optional = servicioAlumno.getById(id);

        if(!optional.isPresent()){
            return ResponseEntity.notFound().build();
        }

        a.setId(id);

        Optional<Alumno> alumnoActualizado = servicioAlumno.update(id, a);
        if (!alumnoActualizado.isPresent()) {
            return ResponseEntity.badRequest().body("No se ha podido actualizar el alumno con el id: " + id);
        }

        URI location = URI.create("/api/alumnos/" + a.getId());

        return ResponseEntity.ok().location(location).body(alumnoActualizado);
    }

    @Override
    public ResponseEntity<?> delete(@PathVariable Long id) {
        boolean alumnoEliminado = servicioAlumno.delete(id);

        if(alumnoEliminado){
            return ResponseEntity.ok("Alumno eliminado con éxito");
        }else{
            return ResponseEntity.badRequest().body("No se ha encontrado al alumno con el id: " + id);
        }
    }
    
}
