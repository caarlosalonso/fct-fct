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
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Tutores;
import es.daw2.fct_fct.servicio.ServicioTutores;



@RestController
public class ControladorTutores {

    @Autowired
    private ServicioTutores servicioTutores;

    //Crud
    @PostMapping("/addTutor")
    public ResponseEntity<?> crearTutores(@RequestBody Tutores t) {
        servicioTutores.addTutores(t);
        
        URI location = URI.create("/listarTutoresId" +t.getId());

        return ResponseEntity.created(location).body(t);
    }
    

    //cRud
    @GetMapping("/listarTutores")
    public ResponseEntity<?> listaTutores() {
        Iterable<Tutores> it = servicioTutores.listaTutores();

        if (it!=null) {
            return ResponseEntity.ok(it);
        }else{
            return ResponseEntity.badRequest().build();
        }
    }

    //cRud
    @GetMapping("/tutores/{id}")
    public ResponseEntity<?> listaTutoresId(@PathVariable Long id) {
        Optional<Tutores> Tutores = servicioTutores.getTutoresId(id);

        if (Tutores.isPresent()) {
            return ResponseEntity.ok(Tutores.get());
        }else{
            return ResponseEntity.status(404).body("No se encontraron tutores con el id: " + id); //No me deja poner el notFound()
        }
    }
    
    //crUd
    @PostMapping("/actualizarTutores/{id}")
    public ResponseEntity<?> actualizarTutor(@PathVariable Long id, @RequestBody Tutores a){
        Optional<Tutores> optional = servicioTutores.getTutoresId(id);

        if(!optional.isPresent()){
            return ResponseEntity.notFound().build();
        }

        a.setId(id);

        Tutores tutorActualizado = servicioTutores.addTutores(a);

        URI location = URI.create("/tutores/" +a.getId());

        return ResponseEntity.ok().location(location).body(tutorActualizado);
    }

    //cruD
    @DeleteMapping("/borrarTutor/{id}")
    public ResponseEntity<?> borrarTutor(@PathVariable Long id){
        boolean tutorEliminado = servicioTutores.borrarTutores(id);

        if(tutorEliminado){
            return ResponseEntity.ok("Tutor eliminado con éxito");
        }else{
            return ResponseEntity.badRequest().body("No se ha encontrado al tutor con el id: " + id);
        }
    }
}
