package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.Tutor;
import es.daw2.fct_fct.repositorio.RepositorioTutores;


@Service
public class ServicioTutores extends AbstractService<Long, Tutor, RepositorioTutores> {

    public Optional<Tutor> getByUserId(Long userId) {
        return ((List<Tutor>) repository.findAll())
            .stream()
            .filter(tutor -> tutor.getUser().getId().equals(userId))
            .findFirst();
    }

    public List<Tutor> getTutoresSinGrupoEnCicloLectivo(Long cicloLectivoId) {
        List<Tutor> todos = this.list();
        List<Tutor> asignados = repository.findTutoresAsignadosEnCicloLectivo(cicloLectivoId);

        Set<Long> idsAsignados = asignados.stream()
            .map(Tutor::getId)
            .collect(Collectors.toSet());

        return todos.stream()
            .filter(t -> !idsAsignados.contains(t.getId()))
            .collect(Collectors.toList());
    }
}
