package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.dto.CreateGrupoDTO;
import es.daw2.fct_fct.dto.GrupoAllDTO;
import es.daw2.fct_fct.modelo.Ciclo;
import es.daw2.fct_fct.modelo.CicloLectivo;
import es.daw2.fct_fct.modelo.Grupo;
import es.daw2.fct_fct.servicio.ServicioCiclo;
import es.daw2.fct_fct.servicio.ServicioCicloLectivo;
import es.daw2.fct_fct.servicio.ServicioGrupo;


@RestController
@RequestMapping("/api/grupos")
public class ControladorGrupo extends CrudController<Long, Grupo, CreateGrupoDTO, CreateGrupoDTO, ServicioGrupo> {

    @Autowired
    private ServicioCiclo servicioCiclo;

    @Autowired
    private ServicioCicloLectivo servicioCicloLectivo;

    @Override
    public ResponseEntity<?> create(@RequestBody CreateGrupoDTO dto) {
        Grupo grupo = new Grupo();

        Optional<Ciclo> cicloOpt = servicioCiclo.getById(dto.ciclo());
        if (! cicloOpt.isPresent()) {
            return ResponseEntity.badRequest().body("No se encontró el ciclo con el id: " + dto.ciclo());
        }

        Optional<CicloLectivo> cicloLectivoOpt = servicioCicloLectivo.getById(dto.cicloLectivo());
        if (! cicloLectivoOpt.isPresent()) {
            return ResponseEntity.badRequest().body("No se encontró el ciclo lectivo con el id: " + dto.cicloLectivo());
        }

        Ciclo ciclo = cicloOpt.get();
        if (dto.numero() == null || dto.numero() < 1 || dto.numero() > ciclo.getYears()) {
            return ResponseEntity.badRequest().body("El número de grupo debe estar entre 1 y " + ciclo.getYears());
        }

        grupo.setCiclo(ciclo);
        grupo.setCicloLectivo(cicloLectivoOpt.get());
        grupo.setNumero(dto.numero());
        grupo.setHorario(dto.horario());

        service.save(grupo);

        URI location = URI.create("/api/grupos/" + grupo.getId());

        return ResponseEntity.created(location).body(grupo);
    }

    @Override
    ResponseEntity<?> all() {
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

    // getById ya existe en CrudController

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody CreateGrupoDTO dto) {
        Optional<Grupo> gruposOpt = service.getById(id);

        if (gruposOpt.isEmpty()) {
            System.out.println("No se encontró el grupo con el id: " + id);
            return ResponseEntity.notFound().build();
        }
        Grupo grupo = new Grupo();

        Optional<Ciclo> cicloOpt = servicioCiclo.getById(dto.ciclo());
        if (! cicloOpt.isPresent()) {
            return ResponseEntity.badRequest().body("No se encontró el ciclo con el id: " + dto.ciclo());
        }

        Optional<CicloLectivo> cicloLectivoOpt = servicioCicloLectivo.getById(dto.cicloLectivo());
        if (! cicloLectivoOpt.isPresent()) {
            return ResponseEntity.badRequest().body("No se encontró el ciclo lectivo con el id: " + dto.cicloLectivo());
        }

        Ciclo ciclo = cicloOpt.get();
        if (dto.numero() == null || dto.numero() < 1 || dto.numero() > ciclo.getYears()) {
            return ResponseEntity.badRequest().body("El número de grupo debe estar entre 1 y " + ciclo.getYears());
        }

        grupo.setId(id);
        grupo.setCiclo(ciclo);
        grupo.setCicloLectivo(cicloLectivoOpt.get());
        grupo.setNumero(dto.numero());
        grupo.setHorario(dto.horario());

        Optional<Grupo> grupoActualizado = service.update(id, grupo);
        if (! grupoActualizado.isPresent()) {
            return ResponseEntity.badRequest().body("No se ha podido actualizar el grupo con el id: " + id);
        }

        URI location = URI.create("/api/grupos/" + id);

        return ResponseEntity.created(location).body(grupoActualizado.get());
    }

    // delete ya existe en CrudController
}
