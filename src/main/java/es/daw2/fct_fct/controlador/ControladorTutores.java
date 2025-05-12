package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Alumnos;
import es.daw2.fct_fct.servicio.ServicioTutores;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
public class ControladorTutores {

    @Autowired
    private ServicioTutores servicioTutores;

    //Crud
    @PostMapping("/addAlumno")
    public ResponseEntity<?> crearAlumno(@RequestBody Alumnos a) {
        servicioTutores.addAlumnos(a);
        
        URI location = URI.create("/listarAlumnosId" +a.getId());

        return ResponseEntity.created(location).body(a);
    }
    

    //cRud
    @GetMapping("/listarAlumnos")
    public ResponseEntity<?> listaAlumnos() {
        Iterable<Alumnos> it = null;
        it = servicioTutores.listaAlumnos();

        if (it!=null) {
            return ResponseEntity.ok(it);
        }else{
            return ResponseEntity.badRequest().build();
        }
    }

    //cRud
    @GetMapping("/alumnos/{id}")
    public ResponseEntity<?> listaAlumnosId(@PathVariable Long id) {
        Optional<Alumnos> alumnos = servicioTutores.getAlumnosId(id);

        if (alumnos.isPresent()) {
            return ResponseEntity.ok(alumnos.get());
        }else{
            return ResponseEntity.status(404).body("No se encontraron alumnos con el id: " + id); //No me deja poner el notFound()
        }
    }
    
    //crUd
    @PostMapping("/actualizarAlumnos/{id}")
    public ResponseEntity<?> actualizarAlumno(@PathVariable Long id, @RequestBody Alumnos a){
        Optional<Alumnos> optional = servicioTutores.getAlumnosId(id);

        if(!optional.isPresent()){
            return ResponseEntity.notFound().build();
        }

        a.setId(id);

        Alumnos alumnoActualizado = servicioTutores.addAlumnos(a);

        URI location = URI.create("/alumnos/" +a.getId());

        return ResponseEntity.ok().location(location).body(alumnoActualizado);
    }

    //cruD
    @DeleteMapping("/borrarAlumno/{id}")
    public ResponseEntity<?> borrarAlumno(@PathVariable Long id){
        boolean alumnoEliminado = servicioTutores.borrarAlumnos(id);

        if(alumnoEliminado){
            return ResponseEntity.ok("Alumno eliminado con éxito");
        }else{
            return ResponseEntity.badRequest().body("No se ha encontrado al alumno con el id: " + id);
        }
    }
    
}
