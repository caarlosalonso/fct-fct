package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Curso;
import es.daw2.fct_fct.modelo.Empresa;
import es.daw2.fct_fct.modelo.Fct;
import es.daw2.fct_fct.modelo.TutorEmpresa;
import es.daw2.fct_fct.servicio.ServicioCurso;
import es.daw2.fct_fct.servicio.ServicioEmpresa;
import es.daw2.fct_fct.servicio.ServicioFCT;
import es.daw2.fct_fct.servicio.ServicioTutorEmpresa;
import es.daw2.fct_fct.dto.CreateFctDTO;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/fcts")
public class ControladorFCT extends CrudController<Long, Fct, Fct, Fct, ServicioFCT> {

    @Autowired
    private ServicioTutorEmpresa servicioTutorEmpresa;

    @Autowired
    private ServicioCurso servicioCurso;

    @Autowired
    private ServicioEmpresa servicioEmpresa;

    @PostMapping("/fct")
    public ResponseEntity<?> createOrUpdate(@RequestBody CreateFctDTO dto, HttpServletRequest request) {
        Optional<Fct> fctOpt = service.getByCursoId(dto.cursoId());
        System.out.println("FctOpt: " + dto);
        if (fctOpt.isPresent()) {
            return updateFct(dto);
        } else {
            return createFct(dto);
        }
    }

    @Override
    public ResponseEntity<?> create(@RequestBody Fct dto, HttpServletRequest request) {
        throw new UnsupportedOperationException("No uses esto");
    }

    // all ya existe en CrudController

    // getById ya existe en CrudController

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Fct dto, HttpServletRequest request) {
        throw new UnsupportedOperationException("No uses esto");
    }

    public ResponseEntity<?> createFct(CreateFctDTO dto) {
        System.out.println("DTO: " + dto);

        Fct fct = new Fct();
        Optional<Curso> cursoOpt = servicioCurso.getById(dto.cursoId());
        if (!cursoOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        fct.setCurso(cursoOpt.get());
        System.out.println("Ping 11");

        if (dto.renuncia() == null) return ResponseEntity.badRequest().body("El campo 'renuncia' es obligatorio");
        System.out.println("Ping 12");

        System.out.println(dto.renuncia());
        System.out.println(dto.renuncia().booleanValue());
        if (dto.renuncia().booleanValue()) {
            System.out.println("Ping 121");
            fct.setMotivoRenuncia(dto.motivoRenuncia());
            fct.setApto(false);
            service.save(fct);
            URI location = URI.create("/api/fct/" + fct.getId());
            System.out.println("Ping 122");
            return ResponseEntity.created(location).body(fct);
        }

        Optional<Empresa> empresaOpt = servicioEmpresa.getById(dto.empresaId());
        if (!empresaOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        fct.setEmpresa(empresaOpt.get());
        System.out.println("Ping 13");

        if (dto.tutorEmpresaId() != null) {
            Optional<TutorEmpresa> tutorOpt = servicioTutorEmpresa.getById(dto.tutorEmpresaId());
            if (!tutorOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            fct.setTutorEmpresa(tutorOpt.get());
        }
        System.out.println("Ping 14");

        fct.setFechaInicio(dto.fechaInicio());
        fct.setHorasSemana(dto.horasSemanales());
        fct.setNoLectivos(dto.noLectivos());
        fct.setHorasPracticas(dto.horasDePracticas());
        fct.setFechaFin(dto.fechaFin());
        fct.setApto(false);

        service.save(fct);

        URI location = URI.create("/api/fct/" + fct.getId());

        return ResponseEntity.created(location).body(fct);
    }

    public ResponseEntity<?> updateFct(CreateFctDTO dto) {
        Optional<Fct> fctOpt = service.getByCursoId(dto.cursoId());
        if (!fctOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Fct fct = fctOpt.get();

        if (dto.renuncia() == null) return ResponseEntity.badRequest().body("El campo 'renuncia' es obligatorio");

        if (dto.renuncia()) {
            fct.setMotivoRenuncia(dto.motivoRenuncia());
            fct.setApto(false);
            service.save(fct);
            URI location = URI.create("/api/fct/" + fct.getId());
            return ResponseEntity.created(location).body(fct);
        }
        System.out.println("Ping 21");

        Optional<Curso> cursoOpt = servicioCurso.getById(dto.cursoId());
        if (!cursoOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        fct.setCurso(cursoOpt.get());
        System.out.println("Ping 22");

        Optional<Empresa> empresaOpt = servicioEmpresa.getById(dto.empresaId());
        if (!empresaOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        fct.setEmpresa(empresaOpt.get());
        System.out.println("Ping 23");

        if (dto.tutorEmpresaId() != null) {
            Optional<TutorEmpresa> tutorOpt = servicioTutorEmpresa.getById(dto.tutorEmpresaId());
            if (!tutorOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            fct.setTutorEmpresa(tutorOpt.get());
        }
        System.out.println("Ping 24");

        fct.setFechaInicio(dto.fechaInicio());
        fct.setHorasSemana(dto.horasSemanales());
        fct.setNoLectivos(dto.noLectivos());
        fct.setHorasPracticas(dto.horasDePracticas());
        fct.setFechaFin(dto.fechaFin());
        fct.setApto(false);

        Optional<Fct> fctActualizado = service.update(fct.getId(), fct);
        if (!fctActualizado.isPresent()) {
            return ResponseEntity.badRequest().body("No se ha podido actualizar el FCT con el id: " + fct.getId());
        }

        URI location = URI.create("/api/fct/" + fct.getId());

        return ResponseEntity.created(location).body(fctActualizado);
    }
}
