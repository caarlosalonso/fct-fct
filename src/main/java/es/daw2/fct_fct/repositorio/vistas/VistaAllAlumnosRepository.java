package es.daw2.fct_fct.repositorio.vistas;

import es.daw2.fct_fct.modelo.vistas.VistaAllAlumnos;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VistaAllAlumnosRepository extends CrudRepository<VistaAllAlumnos, Long> {
}
