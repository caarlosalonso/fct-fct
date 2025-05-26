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

import es.daw2.fct_fct.modelo.Coordinacion;
import es.daw2.fct_fct.servicio.ServicioCoordinacion;

@RestController
public class ControladorCoordinacion {

    @Autowired
    private ServicioCoordinacion servicioCoordinacion;

    //Crud
    @PostMapping("/addCoordinacion")
    public ResponseEntity<?> crearCoordinacion(@RequestBody Coordinacion c) {
        servicioCoordinacion.addCoordinacion(c);

        URI location = URI.create("/listarCoordinacionId" +c.getCoordinacion_id());

        return ResponseEntity.created(location).body(c);
    }
    

    //cRud
    @GetMapping("/listarCoordinacion")
    public ResponseEntity<?> listaCoordinacion() {
        Iterable<Coordinacion> it = servicioCoordinacion.listaCoordinacion();

        if (it!=null) {
            return ResponseEntity.ok(it);
        }else{
            return ResponseEntity.badRequest().build();
        }
    }

    //cRud
    @GetMapping("/coordinacion/{id}")
    public ResponseEntity<?> listaCoordinacionId(@PathVariable Long id) {
        Optional<Coordinacion> coordinacion = servicioCoordinacion.getCoordinacionId(id);

        if (coordinacion.isPresent()) {
            return ResponseEntity.ok(coordinacion.get());
        }else{
            return ResponseEntity.status(404).body("No se encontó personal de coordinacion con el id: " + id); //No me deja poner el notFound()
        }
    }
    
    //crUd
    @PostMapping("/actualizarCoordinacion/{id}")
    public ResponseEntity<?> actualizarCoordinacion(@PathVariable Long id, @RequestBody Coordinacion c){
        Optional<Coordinacion> optional = servicioCoordinacion.getCoordinacionId(id);

        if(!optional.isPresent()){
            return ResponseEntity.notFound().build();
        }

        c.setCoordinacion_id(id);

        Coordinacion coordinacionActualizado = servicioCoordinacion.addCoordinacion(c);

        URI location = URI.create("/coordinacion/" +c.getCoordinacion_id());

        return ResponseEntity.ok().location(location).body(coordinacionActualizado);
    }

    //cruD
    @DeleteMapping("/borrarCoordinacion/{id}")
    public ResponseEntity<?> borrarTutor(@PathVariable Long id){
        boolean coordinacionEliminado = servicioCoordinacion.borrarCoordinacion(id);

        if(coordinacionEliminado){
            return ResponseEntity.ok("Coordinacion eliminada con éxito");
        }else{
            return ResponseEntity.badRequest().body("No se ha encontrado al coordinador con el id: " + id);
        }
    }

}
