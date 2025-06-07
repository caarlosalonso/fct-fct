package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.Grupo;
import es.daw2.fct_fct.repositorio.RepositorioGrupos;


@Service
public class ServicioGrupo extends AbstractService<Long, Grupo, RepositorioGrupos> {

    @Override
    public Optional<Grupo> getById(Long id) {
        Optional<Grupo> grupo = repository.findById(id);
        return grupo.filter((g) -> g.getDeletedAt() == null);
    }
    
    @Override
    public List<Grupo> list() {
        List<Grupo> grupos = (List<Grupo>) repository.findAll();
        grupos = grupos.stream()
            .filter((grupo) -> grupo.getDeletedAt() == null)
            .toList();
        return grupos;
    }

    @Override
    public boolean delete(Long id) {
        if (id == null) return false;
        Optional<Grupo> grupo = repository.findById(id);
        if (grupo.filter((g) -> g.getDeletedAt() == null).isEmpty()) {
            return false;
        }
        repository.deleteById(id);
        return true;
    }
}
