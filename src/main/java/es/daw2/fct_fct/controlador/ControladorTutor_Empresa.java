package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Tutor_empresa;
import es.daw2.fct_fct.servicio.ServicioTutor_Empresa;


@RestController
@RequestMapping("/api/tutor_empresa")
public class ControladorTutor_Empresa extends CrudController<Long, Tutor_empresa, Tutor_empresa, Tutor_empresa, ServicioTutor_Empresa> {

    @Autowired
    private ServicioTutor_Empresa servicioTutor_Empresa;

    @Override
    public ResponseEntity<?> create(@RequestBody Tutor_empresa t) {
        servicioTutor_Empresa.save(t);

        URI location = URI.create("/api/tutor_empresa/" + t.getId());

        return ResponseEntity.created(location).body(t);
    }

    @Override
    public ResponseEntity<?> all() {
        Iterable<Tutor_empresa> it = servicioTutor_Empresa.list();

        if (it!=null) {
            return ResponseEntity.ok(it);
        }else{
            return ResponseEntity.badRequest().build();
        }
    }

    @Override
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Optional<Tutor_empresa> tutor_empresa = servicioTutor_Empresa.getById(id);

        if (tutor_empresa.isPresent()) {
            return ResponseEntity.ok(tutor_empresa.get());
        }else{
            return ResponseEntity.status(404).body("No se encontraron tutores con el id: " + id); //No me deja poner el notFound()
        }
    }

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Tutor_empresa t) {
        Optional<Tutor_empresa> tutor_empresa = servicioTutor_Empresa.getById(id);

        if (!tutor_empresa.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        t.setId(id);

        Optional<Tutor_empresa> tutorActualizado = servicioTutor_Empresa.update(id, t);
        if (!tutorActualizado.isPresent()) {
            return ResponseEntity.badRequest().body("No se ha podido actualizar el tutor con el id: " + id);
        }

        URI location = URI.create("/api/tutor_empresa/" + t.getId());

        return ResponseEntity.ok().location(location).body(tutorActualizado);
    }

    @Override
    public ResponseEntity<?> delete(@PathVariable Long id) {
        boolean tutor_empresaEliminado = servicioTutor_Empresa.delete(id);

        if (tutor_empresaEliminado) {
            return ResponseEntity.ok().body("Tutor de empresa eliminado con éxito");
        } else {
            return ResponseEntity.status(404).body("No se encontraron tutores con el id: " + id);
        }
    }
}
