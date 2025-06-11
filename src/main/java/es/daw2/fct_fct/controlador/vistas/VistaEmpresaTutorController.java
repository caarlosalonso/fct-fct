package es.daw2.fct_fct.controlador.vistas;

import es.daw2.fct_fct.dto.VistaEmpresaTutorDTO;
import es.daw2.fct_fct.modelo.Empresa;
import es.daw2.fct_fct.modelo.TutorEmpresa;
import es.daw2.fct_fct.modelo.User;
import es.daw2.fct_fct.modelo.vistas.VistaEmpresaTutor;
import es.daw2.fct_fct.repositorio.RepositorioUser;
import es.daw2.fct_fct.servicio.vistas.VistaEmpresaTutorService;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import es.daw2.fct_fct.servicio.ServicioEmpresa;
import es.daw2.fct_fct.servicio.ServicioTutorEmpresa;
import es.daw2.fct_fct.servicio.ServicioUser;

@RestController
@RequestMapping("/api/vista-empresas-tutores")
public class VistaEmpresaTutorController {

    @Autowired
    private VistaEmpresaTutorService service;

    @Autowired
    private ServicioEmpresa serviceEmpresa;

    @Autowired
    private ServicioTutorEmpresa serviceTutorEmpresa;

    @Autowired
    private ServicioUser serviceUser;

    @Autowired
    private RepositorioUser userRepository;

    @GetMapping("/all")
    public ResponseEntity<?> obtenerTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{empresaId}")
    public ResponseEntity<VistaEmpresaTutor> obtenerPorId(@PathVariable Long empresaId) {
        return service.buscarPorId(empresaId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/completo/{empresaId}")
    public ResponseEntity<?> actualizarVistaCompleta(@PathVariable Long empresaId, @RequestBody VistaEmpresaTutorDTO dto, HttpServletRequest request) {
        Optional<Empresa> empresaOpt = serviceEmpresa.getById(empresaId);
        if (!empresaOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró la empresa con el id: " + empresaId);
        }

        Empresa empresa = empresaOpt.get();
        empresa.setNombre(dto.nombre());
        empresa.setCif(dto.cif());
        empresa.setSector(dto.sector());
        empresa.setAddress(dto.address());
        empresa.setPhone(dto.phone());
        empresa.setEmail(dto.email());
        empresa.setPersona_contacto(dto.persona_contacto());
        empresa.setEstado(dto.estado());
        empresa.setObservaciones(dto.observaciones());
        empresa.setNumero_convenio(dto.numero_convenio());
        empresa.setNumero_plazas(dto.numero_plazas());
        empresa.setHay_convenio(dto.hay_convenio());
        empresa.setFecha_contacto(dto.fecha_contacto());

        // Actualizar propuesta_por si viene en el JSON
        if (dto.propuesta_por() != null) {
            userRepository.findById(dto.propuesta_por()).ifPresentOrElse(
                empresa::setPropuesta_por,
                () -> empresa.setPropuesta_por(null)
            );
        } else {
            empresa.setPropuesta_por(null);
        }
        serviceEmpresa.update(empresaId, empresa);

        // Tutor empresa
        if (dto.tutor_empresaId() != null) {
            Optional<TutorEmpresa> tutorOpt = serviceTutorEmpresa.getById(dto.tutor_empresaId());
            if (tutorOpt.isPresent()) {
                TutorEmpresa tutor = tutorOpt.get();
                tutor.setNombre(dto.nombre_tutor());
                serviceTutorEmpresa.update(tutor.getId(), tutor);
            }
        }

        // User
        if (dto.userId() != null) {
            Optional<User> userOpt = serviceUser.getById(dto.userId());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setName(dto.nombre_usuario());
                serviceUser.update(user.getId(), user);
            }
        }

        return ResponseEntity.ok("Actualización completa realizada");
    }
}
