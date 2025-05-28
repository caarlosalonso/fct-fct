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

import es.daw2.fct_fct.modelo.Grupo;
import es.daw2.fct_fct.servicio.ServicioGrupo;


@RestController
public class ControladorGrupo {

    @Autowired
    private ServicioGrupo servicioGrupo;

    //Crud
    @PostMapping("/addGrupo")
    public ResponseEntity<?> crearGrupo(@RequestBody Grupo g) {
        servicioGrupo.addGrupos(g);

        URI location = URI.create("/listarGruposId" + g.getId());

        return ResponseEntity.created(location).body(g);
    }
    

    //cRud
    @GetMapping("/listarGrupos")
    public ResponseEntity<?> listaGrupos() {
        Iterable<Grupo> it = servicioGrupo.listaGrupos();

        if (it!=null) {
            return ResponseEntity.ok(it);
        }else{
            return ResponseEntity.badRequest().build();
        }
    }

    //cRud
    @GetMapping("/grupos/{id}")
    public ResponseEntity<?> listaGruposId(@PathVariable Long id) {
        Optional<Grupo> grupos = servicioGrupo.getGruposId(id);

        if (grupos.isPresent()) {
            return ResponseEntity.ok(grupos.get());
        }else{
            return ResponseEntity.status(404).body("No se encontraron grupos con el id: " + id); //No me deja poner el notFound()
        }
    }

    //crUd
    @PostMapping("/actualizarGrupo/{id}")
    public ResponseEntity<?> actualizarGrupo(@PathVariable Long id, @RequestBody Grupo g) {
        Optional<Grupo> grupos = servicioGrupo.getGruposId(id);

        if (!grupos.isPresent()) {
            return ResponseEntity.status(404).body("No se encontraron grupos con el id: " + id); //No me deja poner el notFound()
        }

        g.setId(id);

        Grupo grupoActualizado = servicioGrupo.addGrupos(g);

        URI location = URI.create("/listarGruposId" + grupoActualizado.getId());

        return ResponseEntity.created(location).body(grupoActualizado);
    }

    //cruD
    @DeleteMapping("/borrarGrupo/{id}")
    public ResponseEntity<?> borrarGrupo(@PathVariable Long id) {
        boolean grupoEliminado = servicioGrupo.borrarGrupos(id);

        if (grupoEliminado) {
            return ResponseEntity.ok("Grupo borrado con éxito");
        } else {
            return ResponseEntity.badRequest().body("No se encontraron grupos con el id: " + id); //No me deja poner el notFound()
        }
    }
}
