package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.Alumno;
import es.daw2.fct_fct.repositorio.RepositorioAlumno;


@Service
public class ServicioAlumno extends AbstractService<Long, Alumno, RepositorioAlumno> {

    public Optional<Alumno> getByUserId(Long userId) {
        return ((List<Alumno>) repository.findAll())
            .stream()
            .filter(alumno -> alumno.getUser().getId().equals(userId))
            .findFirst();
    }
}
