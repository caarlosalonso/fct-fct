package es.daw2.fct_fct.repositorio;

import java.util.Optional;
import org.springframework.data.repository.CrudRepository;

import es.daw2.fct_fct.modelo.vAlumno;

public interface RepositorioVAlumno extends CrudRepository<vAlumno, Long>{
    Optional<vAlumno> findById(Long id);
}
