package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.dto.CreateTutoriaDTO;
import es.daw2.fct_fct.modelo.Grupo;
import es.daw2.fct_fct.modelo.Tutoria;
import es.daw2.fct_fct.servicio.ServicioGrupo;
import es.daw2.fct_fct.servicio.ServicioTutoria;
import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/api/tutorias")
public class ControladorTutoria extends CrudController<Long, Tutoria, CreateTutoriaDTO, Tutoria, ServicioTutoria> {

    @Autowired
    private ServicioGrupo servicioGrupo;

    @Override
    public ResponseEntity<?> create(@RequestBody CreateTutoriaDTO t, HttpServletRequest request) {
        Tutoria tutoria = new Tutoria();
        tutoria.setFecha(t.fecha());

        Optional<Grupo> grupoOpt = servicioGrupo.getById(t.grupoId());
        if (grupoOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("El grupo con id " + t.grupoId() + " no existe.");
        }
        tutoria.setGrupo(grupoOpt.get());

        service.save(tutoria);
        URI location = URI.create("/api/tutorias/" + tutoria.getId());

        return ResponseEntity.created(location).body(tutoria);
    }

    // all ya existe en CrudController

    // getById ya existe en CrudController

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Tutoria t, HttpServletRequest request) {
        Optional<Tutoria> tutoria = service.getById(id);

        if (!tutoria.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        t.setId(id);

        Optional<Tutoria> tutoriaActualizada = service.update(id, t);
        if (!tutoriaActualizada.isPresent()) {
            return ResponseEntity.badRequest().body("No se ha podido actualizar la tutoría con el id: " + id);
        }

        URI location = URI.create("/api/tutorias/" + t.getId());

        return ResponseEntity.ok().location(location).body(tutoriaActualizada);
    }

    // delete ya existe en CrudController
}
