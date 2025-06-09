package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.Tutor;
import es.daw2.fct_fct.repositorio.RepositorioTutores;


@Service
public class ServicioTutores extends AbstractService<Long, Tutor, RepositorioTutores> {

    public Optional<Tutor> getByUserId(Long userId) {
        return ((List<Tutor>) repository.findAll())
            .stream()
            .filter(tutor -> tutor.getUser().getId().equals(userId))
            .findFirst();
    }

    @Autowired
    private ServicioGrupo servicioGrupos;

    @Autowired
    private ServicioCicloLectivo servicioCicloLectivo;

    public List<?> getTutoresSinGrupo(Long cicloId) {
        List<Tutor> tutores = this.list();



        servicioGrupos.list()
            .forEach((grupo) -> {
                
            });

        return null;
    }
}
