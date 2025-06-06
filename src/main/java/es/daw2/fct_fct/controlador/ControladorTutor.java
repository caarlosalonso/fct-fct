package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Tutor;
import es.daw2.fct_fct.servicio.ServicioTutores;


@RestController
@RequestMapping("/api/tutores")
public class ControladorTutor extends CrudController<Long, Tutor, Tutor, Tutor, ServicioTutores> {

    @Override
    public ResponseEntity<?> create(@RequestBody Tutor t) {
        service.save(t);

        URI location = URI.create("/api/tutores/" + t.getId());

        return ResponseEntity.created(location).body(t);
    }

    @Override
    public ResponseEntity<?> all() {
        Iterable<Tutor> it = service.list();

        if (it!=null) {
            return ResponseEntity.ok(it);
        }else{
            return ResponseEntity.badRequest().build();
        }
    }

    @Override
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Optional<Tutor> Tutores = service.getById(id);

        if (Tutores.isPresent()) {
            return ResponseEntity.ok(Tutores.get());
        }else{
            return ResponseEntity.status(404).body("No se encontraron tutores con el id: " + id); //No me deja poner el notFound()
        }
    }

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Tutor a){
        Optional<Tutor> optional = service.getById(id);

        if(!optional.isPresent()){
            return ResponseEntity.notFound().build();
        }

        a.setId(id);

        Optional<Tutor> tutorActualizado = service.update(id, a);
        if (!tutorActualizado.isPresent()) {
            return ResponseEntity.badRequest().body("No se ha podido actualizar el tutor con el id: " + id);
        }

        URI location = URI.create("/api/tutores/" + a.getId());

        return ResponseEntity.ok().location(location).body(tutorActualizado);
    }

    @Override
    public ResponseEntity<?> delete(@PathVariable Long id){
        boolean tutorEliminado = service.delete(id);

        if(tutorEliminado){
            return ResponseEntity.ok("Tutor eliminado con éxito");
        }else{
            return ResponseEntity.badRequest().body("No se ha encontrado al tutor con el id: " + id);
        }
    }
}
