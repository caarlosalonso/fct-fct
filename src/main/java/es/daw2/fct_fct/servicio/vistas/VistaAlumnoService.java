package es.daw2.fct_fct.servicio.vistas;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.vistas.VistaAlumno;
import es.daw2.fct_fct.repositorio.vistas.VistaAlumnoRepository;

@Service
public class VistaAlumnoService {

    @Autowired
    private VistaAlumnoRepository repository;

    public List<VistaAlumno> obtenerTodos() {
        return (List<VistaAlumno>) repository.findAll();
    }

    public VistaAlumno obtenerPorId(Long id) {
        return repository.findById(id).orElse(null);
    }
}
