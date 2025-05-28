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
        servicioCoordinacion.addCoordinacion(c);

        URI location = URI.create("/api/coordinacion/" +c.getId());

        return ResponseEntity.created(location).body(c);
    }
    

    @Override
    public ResponseEntity<?> all() {
        Iterable<Coordinacion> it = servicioCoordinacion.listaCoordinacion();

        if (it!=null) {
            return ResponseEntity.ok(it);
        }else{
            return ResponseEntity.badRequest().build();
        }
    }

    @Override
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Optional<Coordinacion> coordinacion = servicioCoordinacion.getCoordinacionId(id);

        if (coordinacion.isPresent()) {
            return ResponseEntity.ok(coordinacion.get());
        }else{
            return ResponseEntity.status(404).body("No se encontó personal de coordinacion con el id: " + id); //No me deja poner el notFound()
        }
    }

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Coordinacion c){
        Optional<Coordinacion> optional = servicioCoordinacion.getCoordinacionId(id);

        if(!optional.isPresent()){
            return ResponseEntity.notFound().build();
        }

        c.setId(id);

        Coordinacion coordinacionActualizado = servicioCoordinacion.addCoordinacion(c);

        URI location = URI.create("/api/coordinacion/" +c.getId());

        return ResponseEntity.ok().location(location).body(coordinacionActualizado);
    }

    @Override
    public ResponseEntity<?> delete(@PathVariable Long id){
        boolean coordinacionEliminado = servicioCoordinacion.borrarCoordinacion(id);

        if(coordinacionEliminado){
            return ResponseEntity.ok("Coordinacion eliminada con éxito");
        }else{
            return ResponseEntity.badRequest().body("No se ha encontrado al coordinador con el id: " + id);
        }
    }

}
