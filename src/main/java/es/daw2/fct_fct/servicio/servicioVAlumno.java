package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import es.daw2.fct_fct.modelo.vAlumno;
import es.daw2.fct_fct.repositorio.RepositorioVAlumno;

public class servicioVAlumno extends AbstractService<Long, vAlumno, RepositorioVAlumno> {

    public Optional<vAlumno> getByUserId(Long id) {
        List<vAlumno> listaVAlumnos = (List<vAlumno>) repository.findAll();
        for (vAlumno vAlumno : listaVAlumnos) {
            if (vAlumno.getId().equals(id)) {
                return Optional.of(vAlumno);
            }
        }
        return Optional.empty();
    }
}