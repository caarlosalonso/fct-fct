package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.dto.CicloCreateDTO;
import es.daw2.fct_fct.modelo.Ciclo;
import es.daw2.fct_fct.modelo.Grupo;
import es.daw2.fct_fct.servicio.ServicioCiclo;
import es.daw2.fct_fct.servicio.ServicioGrupo;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/ciclos")
public class ControladorCiclo extends CrudController<Long, Ciclo, CicloCreateDTO, CicloCreateDTO, ServicioCiclo> {

    @Autowired
    private ServicioGrupo servicioGrupo;

    @Override
    public ResponseEntity<?> create(@RequestBody CicloCreateDTO dto) {
        Ciclo nuevoCiclo = new Ciclo();

        nuevoCiclo.setName(dto.name());
        nuevoCiclo.setAcronimo(dto.acronimo());
        nuevoCiclo.setNivel(dto.nivel());
        nuevoCiclo.setFamiliaProfesional(dto.familiaProfesional());
        nuevoCiclo.setHorasPracticas(dto.horasPracticas());

        nuevoCiclo = service.save(nuevoCiclo);

        URI location = URI.create("/api/ciclos/" + nuevoCiclo.getId());

        return ResponseEntity.created(location).body(nuevoCiclo);
    }

    // all ya existe en CrudController

    // getById ya existe en CrudController

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody CicloCreateDTO dto) {
        Optional<Ciclo> cicloOpt = service.getById(id);
        if (!cicloOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el ciclo con el id: " + id);
        }

        Ciclo ciclo = cicloOpt.get();
        ciclo.setName(dto.name());
        ciclo.setAcronimo(dto.acronimo());
        ciclo.setNivel(dto.nivel());
        ciclo.setFamiliaProfesional(dto.familiaProfesional());
        ciclo.setHorasPracticas(dto.horasPracticas());

        Optional<Ciclo> cicloActualizado = service.update(id, ciclo);
        if (!cicloActualizado.isPresent()) {
            return ResponseEntity.badRequest().body("No se ha podido actualizar el ciclo con el id: " + id);
        }

        URI location = URI.create("/api/ciclos/" + id);
        return ResponseEntity.created(location).body(cicloActualizado.get());
    }

    @Override
    ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<Ciclo> cicloOpt = service.getById(id);
        if (!cicloOpt.isPresent()) {
            return ResponseEntity.badRequest().body("No se encontró el ciclo con el id: " + id);
        }

        List<Grupo> grupos = servicioGrupo.list()
                .stream()
                .filter(grupo -> grupo.getCiclo().getId().equals(id))
                .toList();

        service.delete(id);
        grupos.forEach((grupo) -> {
            servicioGrupo.delete(grupo.getId());
        });

        return ResponseEntity.noContent().build();
    }
}
