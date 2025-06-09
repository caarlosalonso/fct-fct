package es.daw2.fct_fct.servicio.vistas;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.vistas.VistaGruposCiclos;
import es.daw2.fct_fct.repositorio.vistas.VistaGruposCiclosRepository;

@Service
public class VistaGruposCiclosService {

    @Autowired
    private VistaGruposCiclosRepository repository;

    public List<VistaGruposCiclos> obtenerTodos() {
        return (List<VistaGruposCiclos>) repository.findAll();
    }

    public VistaGruposCiclos obtenerPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Optional<VistaGruposCiclos> getByTutorId(Long tutorId) {
        return ((List<VistaGruposCiclos>) repository.findAll())
            .stream()
            .filter(grupoCiclo -> grupoCiclo.getTutorId().equals(tutorId))
            .findFirst();
    }
}
