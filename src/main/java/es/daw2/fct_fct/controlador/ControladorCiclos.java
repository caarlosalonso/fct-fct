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

import es.daw2.fct_fct.modelo.Ciclos;
import es.daw2.fct_fct.servicio.ServicioCiclos;

@RestController
public class ControladorCiclos {

    @Autowired
    private ServicioCiclos servicioCiclos;

    //Crud
    @PostMapping("/addCiclo")
    public ResponseEntity<?> crearCiclo(@RequestBody Ciclos c) {
        servicioCiclos.addCiclos(c);
        
        URI location = URI.create("/listarCiclosId" +c.getId());

        return ResponseEntity.created(location).body(c);
    }
    

    //cRud
    @GetMapping("/listarCiclos")
    public ResponseEntity<?> listaCiclos() {
        Iterable<Ciclos> it = servicioCiclos.listaCiclos();

        if (it!=null) {
            return ResponseEntity.ok(it);
        }else{
            return ResponseEntity.badRequest().build();
        }
    }

    //cRud
    @GetMapping("/ciclos/{id}")
    public ResponseEntity<?> listaCiclosId(@PathVariable Long id) {
        Optional<Ciclos> ciclos = servicioCiclos.getCiclosId(id);

        if (ciclos.isPresent()) {
            return ResponseEntity.ok(ciclos.get());
        }else{
            return ResponseEntity.status(404).body("No se encontraron ciclos con el id: " + id); //No me deja poner el notFound()
        }
    }

    //crUd
    @PostMapping("/actualizarCiclo/{id}")
    public ResponseEntity<?> actualizarCiclo(@PathVariable Long id, @RequestBody Ciclos c) {
        Optional<Ciclos> ciclos = servicioCiclos.getCiclosId(id);

        if (!ciclos.isPresent()) {
            return ResponseEntity.status(404).body("No se encontraron ciclos con el id: " + id); //No me deja poner el notFound()
        }
        
        c.setId(id);
        
        Ciclos cicloActualizado = servicioCiclos.addCiclos(c);

        URI location = URI.create("/listarCiclosId" + cicloActualizado.getId());

        return ResponseEntity.created(location).body(cicloActualizado);
    }

    //cruD
    @DeleteMapping("/borrarCiclo/{id}")
    public ResponseEntity<?> borrarCiclo(@PathVariable Long id) {
        boolean cicloEliminado = servicioCiclos.borrarCiclos(id);

        if (cicloEliminado) {
            return ResponseEntity.ok("Ciclo borrado con éxito");
        } else {
            return ResponseEntity.badRequest().body("No se encontraron ciclos con el id: " + id); //No me deja poner el notFound()
        }
    }
}
