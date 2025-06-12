package es.daw2.fct_fct.repositorio.vistas;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import es.daw2.fct_fct.modelo.vistas.VistaAlumno;

@Repository
public interface VistaAlumnoRepository extends CrudRepository<VistaAlumno, Long> {

}