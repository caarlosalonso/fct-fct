package es.daw2.fct_fct.servicio.vistas;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.vistas.VistaCoordinadores;
import es.daw2.fct_fct.repositorio.vistas.VistaCoordinadoresRepository;

@Service
public class VistaCoordinadoresService {

    @Autowired
    private VistaCoordinadoresRepository repository;

    public List<VistaCoordinadores> obtenerTodos() {
        return (List<VistaCoordinadores>) repository.findAll();
    }

    public VistaCoordinadores obtenerPorId(Long id) {
        return repository.findById(id).orElse(null);
    }
}
