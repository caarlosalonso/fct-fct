package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.CicloLectivo;
import es.daw2.fct_fct.repositorio.RepositorioCicloLectivo;

@Service
public class ServicioCicloLectivo extends AbstractService<Long, CicloLectivo, RepositorioCicloLectivo> {
    @Override
    public Optional<CicloLectivo> getById(Long id) {
        Optional<CicloLectivo> cicloLectivo = repository.findById(id);
        return cicloLectivo.filter((c) -> c.getDeletedAt() == null);
    }
    
    @Override
    public List<CicloLectivo> list() {
        List<CicloLectivo> ciclosLectivos = (List<CicloLectivo>) repository.findAll();
        ciclosLectivos = ciclosLectivos.stream()
            .filter((ciclo) -> ciclo.getDeletedAt() == null)
            .toList();
        return ciclosLectivos;
    }

    @Override
    public boolean delete(Long id) {
        if (id == null) return false;
        Optional<CicloLectivo> cicloLectivo = repository.findById(id);
        if (cicloLectivo.filter((c) -> c.getDeletedAt() == null).isEmpty()) {
            return false;
        }
        repository.deleteById(id);
        return true;
    }
}
