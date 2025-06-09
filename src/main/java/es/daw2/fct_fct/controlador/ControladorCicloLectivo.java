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

import es.daw2.fct_fct.dto.CicloLectivoCreateDTO;
import es.daw2.fct_fct.modelo.CicloLectivo;
import es.daw2.fct_fct.modelo.Grupo;
import es.daw2.fct_fct.servicio.ServicioCicloLectivo;
import es.daw2.fct_fct.servicio.ServicioGrupo;
import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/api/ciclos-lectivos")
public class ControladorCicloLectivo extends CrudController<Long, CicloLectivo, CicloLectivoCreateDTO, CicloLectivoCreateDTO, ServicioCicloLectivo> {

    @Autowired
    private ServicioGrupo servicioGrupo;

    @Override
    ResponseEntity<?> create(@RequestBody CicloLectivoCreateDTO dto, HttpServletRequest request) {
        CicloLectivo nuevoCicloLectivo = new CicloLectivo();
        nuevoCicloLectivo.setNombre(dto.nombre());
        nuevoCicloLectivo.setFechaInicio(dto.fechaInicio());

        service.list()
            .stream()
            .forEach((cicloLectivo) -> cicloLectivo.setEsActual(false));

        service.list()
            .stream()
            .max((c1, c2) -> c1.getFechaInicio().compareTo(c2.getFechaInicio()))
            .ifPresent(cicloLectivo -> cicloLectivo.setEsActual(true));

        nuevoCicloLectivo = service.save(nuevoCicloLectivo);
        URI location = URI.create("/api/ciclos-lectivos/" + nuevoCicloLectivo.getId());
        return ResponseEntity.created(location).body(nuevoCicloLectivo);
    }

    // all ya existe en CrudController

    // getById ya existe en CrudController

    @Override
    ResponseEntity<?> update(@PathVariable Long id, @RequestBody CicloLectivoCreateDTO dto, HttpServletRequest request) {
        System.out.println(dto);
        
        Optional<CicloLectivo> cicloLectivoOpt = service.getById(id);
        if (!cicloLectivoOpt.isPresent()) {
            return ResponseEntity.badRequest().body("No se encontró el ciclo lectivo con el id: " + id);
        }

        CicloLectivo cicloLectivo = cicloLectivoOpt.get();
        cicloLectivo.setId(id);
        cicloLectivo.setNombre(dto.nombre());
        cicloLectivo.setFechaInicio(dto.fechaInicio());

        Optional<CicloLectivo> updatedCicloLectivo = service.update(id, cicloLectivo);
        if (!updatedCicloLectivo.isPresent()) {
            return ResponseEntity.badRequest().body("No se pudo actualizar el ciclo lectivo con el id: " + id);
        }
        URI location = URI.create("/api/ciclos-lectivos/" + id);
        return ResponseEntity.created(location).body(cicloLectivo);
    }

    @Override
    ResponseEntity<?> delete(@PathVariable Long id, HttpServletRequest request) {
        Optional<CicloLectivo> cicloLectivoOpt = service.getById(id);
        if (!cicloLectivoOpt.isPresent()) {
            return ResponseEntity.badRequest().body("No se encontró el ciclo lectivo con el id: " + id);
        }

        List<Grupo> grupos = servicioGrupo.list()
                .stream()
                .filter(grupo -> grupo.getCicloLectivo().getId().equals(id))
                .toList();

        service.delete(id);
        grupos.forEach((grupo) -> {
            servicioGrupo.delete(grupo.getId());
        });

        return ResponseEntity.noContent().build();
    }
}
