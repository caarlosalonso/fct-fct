package es.daw2.fct_fct.repositorio.vistas;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import es.daw2.fct_fct.modelo.vistas.VistaTutores;

@Repository
public interface VistaTutoresRepository extends CrudRepository<VistaTutores, Long> {

    @Query("""
        SELECT v
        FROM VistaTutores v
        WHERE v.tutorId IN (
            SELECT g.tutor.id
            FROM Grupo g
            WHERE g.cicloLectivo.id = :cicloLectivoId
        )
    """)
    List<VistaTutores> findTutoresAsignadosACiclo(@Param("cicloLectivoId") Long cicloLectivoId);

}
