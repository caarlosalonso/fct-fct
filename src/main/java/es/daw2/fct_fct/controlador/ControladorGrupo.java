package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Grupo;
import es.daw2.fct_fct.servicio.ServicioGrupo;


@RestController
@RequestMapping("/api/grupos")
public class ControladorGrupo extends CrudController<Long, Grupo, Grupo, Grupo, ServicioGrupo> {

    @Override
    public ResponseEntity<?> create(@RequestBody Grupo g) {
        //Grupo grupo = new Grupo();

        service.save(g);

        URI location = URI.create("/api/grupos/" + g.getId());

        return ResponseEntity.created(location).body(g);
    }

    @Override
    public ResponseEntity<?> all() {
        Iterable<Grupo> it = service.list();

        if (it!=null) {
            return ResponseEntity.ok(it);
        }else{
            return ResponseEntity.badRequest().build();
        }
    }

    @Override
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Optional<Grupo> grupos = service.getById(id);

        if (grupos.isPresent()) {
            return ResponseEntity.ok(grupos.get());
        }else{
            return ResponseEntity.status(404).body("No se encontraron grupos con el id: " + id); //No me deja poner el notFound()
        }
    }

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Grupo g) {
        Optional<Grupo> grupos = service.getById(id);

        if (!grupos.isPresent()) {
            return ResponseEntity.status(404).body("No se encontraron grupos con el id: " + id); //No me deja poner el notFound()
        }

        g.setId(id);

        Optional<Grupo> grupoActualizado = service.update(id, g);
        if (!grupoActualizado.isPresent()) {
            return ResponseEntity.badRequest().body("No se ha podido actualizar el grupo con el id: " + id);
        }

        URI location = URI.create("/api/grupos/" + grupoActualizado.get().getId());

        return ResponseEntity.created(location).body(grupoActualizado.get());
    }

    @Override
    public ResponseEntity<?> delete(@PathVariable Long id) {
        boolean grupoEliminado = service.delete(id);

        if (grupoEliminado) {
            return ResponseEntity.ok("Grupo borrado con éxito");
        } else {
            return ResponseEntity.badRequest().body("No se encontraron grupos con el id: " + id); //No me deja poner el notFound()
        }
    }
}
