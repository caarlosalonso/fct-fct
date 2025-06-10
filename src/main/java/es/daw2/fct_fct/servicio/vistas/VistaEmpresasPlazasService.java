package es.daw2.fct_fct.servicio.vistas;

import es.daw2.fct_fct.modelo.vistas.VistaEmpresasPlazas;
import es.daw2.fct_fct.repositorio.vistas.VistaEmpresasPlazasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VistaEmpresasPlazasService {

    @Autowired
    private VistaEmpresasPlazasRepository repository;

    public Iterable<VistaEmpresasPlazas> listarTodos() {
        return repository.findAll();
    }

    public Optional<VistaEmpresasPlazas> buscarPorId(Long id) {
        return repository.findById(id);
    }
}
