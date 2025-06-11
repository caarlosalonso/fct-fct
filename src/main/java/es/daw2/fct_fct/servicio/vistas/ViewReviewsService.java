package es.daw2.fct_fct.servicio.vistas;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.vistas.ViewReviews;
import es.daw2.fct_fct.repositorio.vistas.ViewReviewsRepository;

@Service
public class ViewReviewsService {

    @Autowired
    private ViewReviewsRepository repository;

    public Iterable<ViewReviews> listarTodos() {
        return repository.findAll();
    }

    public Optional<ViewReviews> buscarPorId(Long reviewId) {
        return repository.findById(reviewId);
    }
}
