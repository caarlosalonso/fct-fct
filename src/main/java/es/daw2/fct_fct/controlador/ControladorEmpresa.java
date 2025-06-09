package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Empresa;
import es.daw2.fct_fct.servicio.ServicioEmpresa;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/empresa")
public class ControladorEmpresa extends CrudController<Long, Empresa, Empresa, Empresa, ServicioEmpresa> {

    @Autowired
    private ServicioEmpresa servicioEmpresa;
    
    // all ya existe en CrudController

    // getById ya existe en CrudController

    @Override
    public ResponseEntity<?> create(@RequestBody Empresa dto, HttpServletRequest request) {
        Empresa nuevaEmpresa = new Empresa();

        nuevaEmpresa.setNombre(dto.getNombre());
        nuevaEmpresa.setCif(dto.getCif());
        nuevaEmpresa.setSector(dto.getSector());
        nuevaEmpresa.setAddress(dto.getAddress());
        nuevaEmpresa.setPhone(dto.getPhone());
        nuevaEmpresa.setEmail(dto.getEmail());
        nuevaEmpresa.setPersona_contacto(dto.getPersona_contacto());
        nuevaEmpresa.setEstado(dto.getEstado());
        nuevaEmpresa.setObservaciones(dto.getObservaciones());
        nuevaEmpresa.setPropuesta_por(dto.getPropuesta_por());
        nuevaEmpresa.setNumero_convenio(dto.getNumero_convenio());


        nuevaEmpresa = service.save(nuevaEmpresa);

        URI location = URI.create("/api/empresa/" + nuevaEmpresa.getId());

        return ResponseEntity.created(location).body(nuevaEmpresa);
    }

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Empresa dto, HttpServletRequest request) {
        Optional<Empresa> empresaOpt = service.getById(id);
        if (!empresaOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró la empresa con el id: " + id);
        }

        Empresa empresa = empresaOpt.get();
        empresa.setNombre(dto.getNombre());
        empresa.setCif(dto.getCif());
        empresa.setSector(dto.getSector());
        empresa.setAddress(dto.getAddress());
        empresa.setPhone(dto.getPhone());
        empresa.setEmail(dto.getEmail());
        empresa.setPersona_contacto(dto.getPersona_contacto());
        empresa.setEstado(dto.getEstado());
        empresa.setObservaciones(dto.getObservaciones());
        empresa.setPropuesta_por(dto.getPropuesta_por());
        empresa.setNumero_convenio(dto.getNumero_convenio());
        empresa.setPhone(dto.getPhone());

        Optional<Empresa> empresaActualizada = service.update(id, empresa);
        if (!empresaActualizada.isPresent()) {
            return ResponseEntity.badRequest().body("No se ha podido actualizar la empresa con el id: " + id);
        }

        URI location = URI.create("/api/empresa/" + id);
        return ResponseEntity.created(location).body(empresaActualizada.get());
    }

    @Override
    public ResponseEntity<?> delete(@PathVariable Long id, HttpServletRequest request) {
        Optional<Empresa> empresaOpt = service.getById(id);
        if (!empresaOpt.isPresent()) {
            return ResponseEntity.badRequest().body("No se encontró la empresa con el id: " + id);
        }

        service.delete(id);
        return ResponseEntity.noContent().build();
    }
    
}
