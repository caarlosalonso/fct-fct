package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Tutor;
import es.daw2.fct_fct.servicio.ServicioTutores;


@RestController
@RequestMapping("/api/tutores")
public class ControladorTutor extends CrudController<Long, Tutor, Tutor> {

    @Autowired
    private ServicioTutores servicioTutores;

    @Override
    public ResponseEntity<?> create(@RequestBody Tutor t) {
        servicioTutores.addTutores(t);

        URI location = URI.create("/api/tutores/" + t.getId());

        return ResponseEntity.created(location).body(t);
    }

    @Override
    public ResponseEntity<?> all() {
        Iterable<Tutor> it = servicioTutores.listaTutores();

        if (it!=null) {
            return ResponseEntity.ok(it);
        }else{
            return ResponseEntity.badRequest().build();
        }
    }

    @Override
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Optional<Tutor> Tutores = servicioTutores.getTutoresId(id);

        if (Tutores.isPresent()) {
            return ResponseEntity.ok(Tutores.get());
        }else{
            return ResponseEntity.status(404).body("No se encontraron tutores con el id: " + id); //No me deja poner el notFound()
        }
    }

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Tutor a){
        Optional<Tutor> optional = servicioTutores.getTutoresId(id);

        if(!optional.isPresent()){
            return ResponseEntity.notFound().build();
        }

        a.setId(id);

        Tutor tutorActualizado = servicioTutores.addTutores(a);

        URI location = URI.create("/api/tutores/" + a.getId());

        return ResponseEntity.ok().location(location).body(tutorActualizado);
    }

    @Override
    public ResponseEntity<?> delete(@PathVariable Long id){
        boolean tutorEliminado = servicioTutores.borrarTutores(id);

        if(tutorEliminado){
            return ResponseEntity.ok("Tutor eliminado con éxito");
        }else{
            return ResponseEntity.badRequest().body("No se ha encontrado al tutor con el id: " + id);
        }
    }
}
