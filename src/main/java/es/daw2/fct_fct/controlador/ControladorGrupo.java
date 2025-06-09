package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.dto.CreateGrupoDTO;
import es.daw2.fct_fct.dto.GrupoAllDTO;
import es.daw2.fct_fct.modelo.Ciclo;
import es.daw2.fct_fct.modelo.CicloLectivo;
import es.daw2.fct_fct.modelo.Grupo;
import es.daw2.fct_fct.modelo.Tutor;
import es.daw2.fct_fct.modelo.User.Role;
import es.daw2.fct_fct.servicio.ServicioCiclo;
import es.daw2.fct_fct.servicio.ServicioCicloLectivo;
import es.daw2.fct_fct.servicio.ServicioGrupo;
import es.daw2.fct_fct.servicio.ServicioTutores;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;


@RestController
@RequestMapping("/api/grupos")
public class ControladorGrupo extends CrudController<Long, Grupo, CreateGrupoDTO, CreateGrupoDTO, ServicioGrupo> {

    @Autowired
    private ServicioCiclo servicioCiclo;

    @Autowired
    private ServicioCicloLectivo servicioCicloLectivo;

    @Autowired
    private ServicioTutores servicioTutores;

    @Override
    public ResponseEntity<?> create(@RequestBody CreateGrupoDTO dto, HttpServletRequest request) {
        Grupo grupo = new Grupo();

        Optional<Ciclo> cicloOpt = servicioCiclo.getById(dto.ciclo());
        if (!cicloOpt.isPresent()) {
            return ResponseEntity.badRequest().body("No se encontró el ciclo con el id: " + dto.ciclo());
        }

        Optional<CicloLectivo> cicloLectivoOpt = servicioCicloLectivo.getById(dto.cicloLectivo());
        if (!cicloLectivoOpt.isPresent()) {
            return ResponseEntity.badRequest().body("No se encontró el ciclo lectivo con el id: " + dto.cicloLectivo());
        }
    
        grupo.setCiclo(cicloOpt.get());
        grupo.setCicloLectivo(cicloLectivoOpt.get());
        grupo.setHorario(dto.horario());
        grupo.setNumero(dto.numero());

        Optional<Tutor> tutorOpt = servicioTutores.getById(dto.tutor_id());
        if (!tutorOpt.isPresent()) {
            return ResponseEntity.badRequest().body("No se encontró el tutor con el id: " + dto.tutor_id());
        }
        grupo.setTutor(tutorOpt.get());

        service.save(grupo);

        URI location = URI.create("/api/grupos/" + grupo.getId());

        return ResponseEntity.created(location).body(grupo);
    }

    @Override
    ResponseEntity<?> all(HttpServletRequest request) {
        List<Grupo> items = service.list();
        if (items == null) return ResponseEntity.badRequest().build();
        if (items.isEmpty()) return ResponseEntity.noContent().build();

        GrupoAllDTO[] grupoAllDTO = items.stream()
            .map(grupo -> new GrupoAllDTO(
                grupo.getId(),
                grupo.getCiclo().getId(),
                grupo.getCicloLectivo().getId(),
                grupo.getNumero(),
                grupo.getHorario())
            )
            .toArray(GrupoAllDTO[]::new);

        return ResponseEntity.ok(grupoAllDTO);
    }

    @GetMapping("/tutor")
    public ResponseEntity<?> getById(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return ResponseEntity.status(401).body("No autorizado");
        Object role = session.getAttribute("role");
        if (role == null || ! role.equals(Role.TUTOR)) {
            return ResponseEntity.status(403).body("Forbidden: Sólo los tutores pueden ver el ciclo lectivo actual");
        }

        Long tutorId = (Long) session.getAttribute("user");
        Optional<Grupo> grupoOpt = service.getByTutorId(tutorId);

        if (grupoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(grupoOpt.get());
    }

    // getById ya existe en CrudController

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody CreateGrupoDTO dto, HttpServletRequest request) {
        Optional<Grupo> gruposOpt = service.getById(id);
            System.out.println(dto);

        if (gruposOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Ciclo> cicloOpt = servicioCiclo.getById(dto.ciclo());
        if (! cicloOpt.isPresent()) {
            return ResponseEntity.badRequest().body("No se encontró el ciclo con el id: " + dto.ciclo());
        }

        Optional<CicloLectivo> cicloLectivoOpt = servicioCicloLectivo.getById(dto.cicloLectivo());
        if (! cicloLectivoOpt.isPresent()) {
            return ResponseEntity.badRequest().body("No se encontró el ciclo lectivo con el id: " + dto.cicloLectivo());
        }

        Ciclo ciclo = cicloOpt.get();
        if (dto.numero() == null || dto.numero() < 1 || dto.numero() > 2) {
            return ResponseEntity.badRequest().body("El número de grupo debe estar entre 1 y 2");
        }

        Grupo grupo = gruposOpt.get();
        grupo.setCiclo(ciclo);
        grupo.setCicloLectivo(cicloLectivoOpt.get());
        grupo.setNumero(dto.numero());
        grupo.setHorario(dto.horario());

        Optional<Grupo> grupoActualizado = service.update(id, grupo);
        if (grupoActualizado.isEmpty()) {
            return ResponseEntity.badRequest().body("No se ha podido actualizar el grupo con el id: " + id);
        }

        URI location = URI.create("/api/grupos/" + id);

        return ResponseEntity.created(location).body(grupoActualizado.get());
    }

    // delete ya existe en CrudController
}
