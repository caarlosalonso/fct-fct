package es.daw2.fct_fct.servicio.vistas;

import es.daw2.fct_fct.modelo.vistas.VistaAllAlumnos;
import es.daw2.fct_fct.repositorio.vistas.VistaAllAlumnosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VistaAllAlumnosService {

    @Autowired
    private VistaAllAlumnosRepository repository;

    public Iterable<VistaAllAlumnos> listarTodos() {
        return repository.findAll();
    }

    public Optional<VistaAllAlumnos> buscarPorId(Long userId) {
        return repository.findById(userId);
    }
}
