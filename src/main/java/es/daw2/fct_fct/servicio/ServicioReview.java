package es.daw2.fct_fct.servicio;

import es.daw2.fct_fct.modelo.Review;
import es.daw2.fct_fct.repositorio.ReviewRepository;
import org.springframework.stereotype.Service;

@Service
public class ServicioReview extends AbstractService<Long, Review, ReviewRepository> {

}
