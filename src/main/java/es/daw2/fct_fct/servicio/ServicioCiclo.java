package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.Ciclo;
import es.daw2.fct_fct.repositorio.RepositorioCiclos;


@Service
public class ServicioCiclo extends AbstractService<Long, Ciclo, RepositorioCiclos> {
    @Override
    public Optional<Ciclo> getById(Long id) {
        Optional<Ciclo> ciclo = repository.findById(id);
        return ciclo.filter((c) -> c.getDeletedAt() != null);
    }

    @Override
    public List<Ciclo> list() {
        List<Ciclo> ciclos = (List<Ciclo>) repository.findAll();
        ciclos = ciclos.stream()
            .filter((ciclo) -> ciclo.getDeletedAt() != null)
            .toList();
        return ciclos;
    }

    @Override
    public boolean delete(Long id) {
        if (id == null) return false;
        Optional<Ciclo> ciclo = repository.findById(id);
        if (ciclo.filter((c) -> c.getDeletedAt() != null).isEmpty()) {
            return false;
        }
        repository.deleteById(id);
        return true;
    }
}
