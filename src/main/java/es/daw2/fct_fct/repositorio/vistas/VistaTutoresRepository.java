package es.daw2.fct_fct.repositorio.vistas;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import es.daw2.fct_fct.modelo.vistas.VistaTutores;

@Repository
public interface VistaTutoresRepository extends CrudRepository<VistaTutores, Long> {

}
