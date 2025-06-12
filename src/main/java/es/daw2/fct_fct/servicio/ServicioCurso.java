package es.daw2.fct_fct.servicio;

import java.util.List;

import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.Curso;
import es.daw2.fct_fct.repositorio.RepositorioCurso;


@Service
public class ServicioCurso extends AbstractService<Long, Curso, RepositorioCurso>  {

    public boolean checkIfExistsByGrupoAndAlumno(Long idGrupo, Long idAlumno) {
        if (idGrupo == null || idAlumno == null) return true;

        return ((List<Curso>) repository.findAll())
            .stream()
            .filter(curso -> curso.getGrupo().getId().equals(idGrupo) && curso.getAlumno().getId().equals(idAlumno))
            .findFirst()
            .isPresent();
    }

    public Long getIdByGrupoAndAlumno(Long idGrupo, Long idAlumno) {
        if (idGrupo == null || idAlumno == null) return null;

        return ((List<Curso>) repository.findAll())
            .stream()
            .filter(curso -> curso.getGrupo().getId().equals(idGrupo) && curso.getAlumno().getId().equals(idAlumno))
            .map(Curso::getId)
            .findFirst()
            .orElse(null);
    }
}
