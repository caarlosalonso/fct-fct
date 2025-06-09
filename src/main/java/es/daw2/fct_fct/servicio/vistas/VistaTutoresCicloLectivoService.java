package es.daw2.fct_fct.servicio.vistas;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.vistas.VistaTutoresCicloLectivo;
import es.daw2.fct_fct.repositorio.vistas.VistaTutoresCicloLectivoRepository;

import java.util.Optional;

@Service
public class VistaTutoresCicloLectivoService {

    @Autowired
    private VistaTutoresCicloLectivoRepository repository;

    public Iterable<VistaTutoresCicloLectivo> listarTodos() {
        return repository.findAll();
    }

    public Optional<VistaTutoresCicloLectivo> buscarPorId(Long userId) {
        return repository.findById(userId);
    }
}
