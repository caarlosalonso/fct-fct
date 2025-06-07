package es.daw2.fct_fct.servicio.vistas;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.vistas.VistaInfoAlumno;
import es.daw2.fct_fct.repositorio.vistas.VistaInfoAlumnoRepository;

@Service
public class VistaInfoAlumnoService {

    @Autowired
    private VistaInfoAlumnoRepository repository;

    public List<VistaInfoAlumno> obtenerTodos() {
        return (List<VistaInfoAlumno>) repository.findAll();
    }

    public VistaInfoAlumno obtenerPorId(Long id) {
        return repository.findById(id).orElse(null);
    }
}
