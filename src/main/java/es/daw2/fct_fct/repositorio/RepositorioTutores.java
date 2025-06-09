package es.daw2.fct_fct.repositorio;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import es.daw2.fct_fct.modelo.Tutor;

public interface RepositorioTutores extends CrudRepository<Tutor, Long>{

    @Query("""
        SELECT DISTINCT g.tutor
        FROM Grupo g
        WHERE g.cicloLectivo.id = :cicloLectivoId
    """)
    List<Tutor> findTutoresAsignadosEnCicloLectivo(@Param("cicloLectivoId") Long cicloLectivoId);

}
