package es.daw2.fct_fct.servicio.vistas;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.vistas.VistaTutores;
import es.daw2.fct_fct.repositorio.vistas.VistaTutoresRepository;

@Service
public class VistaTutoresService {

    @Autowired
    private VistaTutoresRepository repository;

    public List<VistaTutores> obtenerTodos() {
        return (List<VistaTutores>) repository.findAll();
    }

    public VistaTutores obtenerPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<VistaTutores> getTutoresSinGrupoEnCicloLectivo(Long cicloLectivoId) {
        List<VistaTutores> todos = this.obtenerTodos();
        List<VistaTutores> asignados = repository.findTutoresAsignadosACiclo(cicloLectivoId);

        Set<Long> idsAsignados = asignados.stream()
            .map(VistaTutores::getTutorId)
            .collect(Collectors.toSet());

        return todos.stream()
            .filter(t -> !idsAsignados.contains(t.getTutorId()))
            .collect(Collectors.toList());
    }
}
