package es.daw2.fct_fct.servicio;

import java.util.Optional;

import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.Fct;
import es.daw2.fct_fct.repositorio.RepositorioFCT;


@Service
public class ServicioFCT extends AbstractService<Long, Fct, RepositorioFCT> {

    public Optional<Fct> getByCursoId(Long cursoId) {
        return this.list()
            .stream()
            .filter(fct -> fct.getCurso().getId().equals(cursoId))
            .findFirst();
    }
}
