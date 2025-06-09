package es.daw2.fct_fct.servicio.vistas;

import es.daw2.fct_fct.modelo.vistas.VistaAlumnosCurso;
import es.daw2.fct_fct.repositorio.vistas.VistaAlumnosCursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VistaAlumnosCursoService {

    @Autowired
    private VistaAlumnosCursoRepository repository;

    public Iterable<VistaAlumnosCurso> listarTodos() {
        return repository.findAll();
    }

    public Optional<VistaAlumnosCurso> buscarPorId(Long userId) {
        return repository.findById(userId);
    }
}
