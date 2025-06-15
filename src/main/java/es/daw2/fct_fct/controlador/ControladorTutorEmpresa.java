package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.dto.CreateTutorEmpresaDTO;
import es.daw2.fct_fct.modelo.Empresa;
import es.daw2.fct_fct.modelo.TutorEmpresa;
import es.daw2.fct_fct.servicio.ServicioEmpresa;
import es.daw2.fct_fct.servicio.ServicioTutorEmpresa;
import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/api/tutores-empresas")
public class ControladorTutorEmpresa extends CrudController<Long, TutorEmpresa, CreateTutorEmpresaDTO, TutorEmpresa, ServicioTutorEmpresa> {

    @Autowired
    private ServicioEmpresa servicioEmpresa;

    @Override
    public ResponseEntity<?> create(@RequestBody CreateTutorEmpresaDTO t, HttpServletRequest request) {
        TutorEmpresa tutorEmpresa = new TutorEmpresa();

        Optional<Empresa> empresa = servicioEmpresa.getById(t.empresaId());
        if (!empresa.isPresent()) {
            return ResponseEntity.badRequest().body("No existe una empresa con el id: " + t.empresaId());
        }

        tutorEmpresa.setEmpresa(empresa.get());
        tutorEmpresa.setNombre(t.nombre());
        tutorEmpresa.setEmail(t.email());
        tutorEmpresa.setTelefono(t.telefono());
        tutorEmpresa.setDni(t.dni());

        TutorEmpresa tutorSaved = service.save(tutorEmpresa);

        URI location = URI.create("/api/tutores-empresas/" + tutorSaved.getId());
        return ResponseEntity.created(location).body(tutorSaved);
    }

    // all ya existe en CrudController

    // getById ya existe en CrudController

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody TutorEmpresa t, HttpServletRequest request) {
        Optional<TutorEmpresa> tutorEmpresa = service.getById(id);

        if (!tutorEmpresa.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        t.setId(id);

        Optional<TutorEmpresa> tutorActualizado = service.update(id, t);
        if (!tutorActualizado.isPresent()) {
            return ResponseEntity.badRequest().body("No se ha podido actualizar el tutor con el id: " + id);
        }

        URI location = URI.create("/api/tutores-empresas/" + t.getId());

        return ResponseEntity.ok().location(location).body(tutorActualizado);
    }

    // delete ya existe en CrudController
}
