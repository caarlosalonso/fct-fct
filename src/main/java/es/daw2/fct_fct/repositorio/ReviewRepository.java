package es.daw2.fct_fct.repositorio;

import es.daw2.fct_fct.modelo.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByEmpresaId(Long empresaId);
}
