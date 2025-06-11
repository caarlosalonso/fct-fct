package es.daw2.fct_fct.servicio.vistas;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.vistas.VistaAlumnoCiclos;
import es.daw2.fct_fct.repositorio.vistas.VistaAlumnoCiclosRepository;

@Service
public class VistaAlumnoCiclosService {

    @Autowired
    private VistaAlumnoCiclosRepository repository;

    public Iterable<VistaAlumnoCiclos> listarTodos() {
        return repository.findAll();
    }

    public Optional<VistaAlumnoCiclos> buscarPorId(Long cicloLectivoId) {
        return repository.findById(cicloLectivoId);
    }

    public Optional<VistaAlumnoCiclos> getByALumnoId(Long alumnoId) {
        return ((List<VistaAlumnoCiclos>) repository.findAll())
            .stream()
            .filter(grupoCiclo -> grupoCiclo.getAlumnoId().equals(alumnoId))
            .findFirst();
    }
}
