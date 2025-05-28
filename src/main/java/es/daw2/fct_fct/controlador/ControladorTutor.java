package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Tutor;
import es.daw2.fct_fct.servicio.ServicioTutores;


@RestController
@RequestMapping("/api/tutores")
public class ControladorTutor {

    @Autowired
    private ServicioTutores servicioTutores;

    //Crud
    @PostMapping("/add")
    public ResponseEntity<?> crearTutores(@RequestBody Tutor t) {
        servicioTutores.addTutores(t);

        URI location = URI.create("/api/tutores/" + t.getId());

        return ResponseEntity.created(location).body(t);
    }
    

    //cRud
    @GetMapping("/all")
    public ResponseEntity<?> listaTutores() {
        Iterable<Tutor> it = servicioTutores.listaTutores();

        if (it!=null) {
            return ResponseEntity.ok(it);
        }else{
            return ResponseEntity.badRequest().build();
        }
    }

    //cRud
    @GetMapping("/{id}")
    public ResponseEntity<?> listaTutoresId(@PathVariable Long id) {
        Optional<Tutor> Tutores = servicioTutores.getTutoresId(id);

        if (Tutores.isPresent()) {
            return ResponseEntity.ok(Tutores.get());
        }else{
            return ResponseEntity.status(404).body("No se encontraron tutores con el id: " + id); //No me deja poner el notFound()
        }
    }
    
    //crUd
    @PostMapping("/update/{id}")
    public ResponseEntity<?> actualizarTutor(@PathVariable Long id, @RequestBody Tutor a){
        Optional<Tutor> optional = servicioTutores.getTutoresId(id);

        if(!optional.isPresent()){
            return ResponseEntity.notFound().build();
        }

        a.setId(id);

        Tutor tutorActualizado = servicioTutores.addTutores(a);

        URI location = URI.create("/api/tutores/" + a.getId());

        return ResponseEntity.ok().location(location).body(tutorActualizado);
    }

    //cruD
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> borrarTutor(@PathVariable Long id){
        boolean tutorEliminado = servicioTutores.borrarTutores(id);

        if(tutorEliminado){
            return ResponseEntity.ok("Tutor eliminado con éxito");
        }else{
            return ResponseEntity.badRequest().body("No se ha encontrado al tutor con el id: " + id);
        }
    }
}
