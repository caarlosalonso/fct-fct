package es.daw2.fct_fct.repositorio.vistas;

import es.daw2.fct_fct.modelo.vistas.VistaAlumnosCurso;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VistaAlumnosCursoRepository extends CrudRepository<VistaAlumnosCurso, Long> {
}
