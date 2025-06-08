package es.daw2.fct_fct.servicio.vistas;

import java.util.List;

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
}
