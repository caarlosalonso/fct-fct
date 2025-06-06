package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Coordinacion;
import es.daw2.fct_fct.servicio.ServicioCoordinacion;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/api/coordinacion")
public class ControladorCoordinacion extends CrudController<Long, Coordinacion, Coordinacion> {

    @Autowired
    private ServicioCoordinacion servicioCoordinacion;

    @Override
    public ResponseEntity<?> create(@RequestBody Coordinacion c) {
        servicioCoordinacion.save(c);

        URI location = URI.create("/api/coordinacion/" +c.getId());

        return ResponseEntity.created(location).body(c);
    }
    

    @Override
    public ResponseEntity<?> all() {
        Iterable<Coordinacion> it = servicioCoordinacion.list();

        if (it!=null) {
            return ResponseEntity.ok(it);
        }else{
            return ResponseEntity.badRequest().build();
        }
    }

    @Override
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Optional<Coordinacion> coordinacion = servicioCoordinacion.getById(id);

        if (coordinacion.isPresent()) {
            return ResponseEntity.ok(coordinacion.get());
        }else{
            return ResponseEntity.status(404).body("No se encontó personal de coordinacion con el id: " + id); //No me deja poner el notFound()
        }
    }

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Coordinacion c){
        Optional<Coordinacion> optional = servicioCoordinacion.getById(id);

        if(!optional.isPresent()){
            return ResponseEntity.notFound().build();
        }

        c.setId(id);

        Optional<Coordinacion> coordinacionActualizado = servicioCoordinacion.update(id, c);
        if (!coordinacionActualizado.isPresent()) {
            return ResponseEntity.badRequest().body("No se ha podido actualizar coordinación con el id: " + id);
        }

        URI location = URI.create("/api/coordinacion/" +c.getId());

        return ResponseEntity.ok().location(location).body(coordinacionActualizado);
    }

    @Override
    public ResponseEntity<?> delete(@PathVariable Long id){
        boolean coordinacionEliminado = servicioCoordinacion.delete(id);

        if(coordinacionEliminado){
            return ResponseEntity.ok("Coordinacion eliminada con éxito");
        }else{
            return ResponseEntity.badRequest().body("No se ha encontrado al coordinador con el id: " + id);
        }
    }

}
