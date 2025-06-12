package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.Coordinacion;
import es.daw2.fct_fct.repositorio.RepositorioCoordinacion;


@Service
public class ServicioCoordinacion extends AbstractService<Long, Coordinacion, RepositorioCoordinacion> {

    public Optional<Coordinacion> getByUserId(Long userId) {
        return ((List<Coordinacion>) repository.findAll())
            .stream()
            .filter(coordinacion -> coordinacion.getUser().getId().equals(userId))
            .findFirst();
    }
}
