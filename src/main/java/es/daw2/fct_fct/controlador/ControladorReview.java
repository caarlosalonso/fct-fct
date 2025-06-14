package es.daw2.fct_fct.controlador;

import es.daw2.fct_fct.modelo.Review;
import es.daw2.fct_fct.servicio.ServicioReview;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ControladorReview extends CrudController<Long, Review, Review, Review, ServicioReview> {

    @Override
    public ResponseEntity<?> create(@RequestBody Review review, HttpServletRequest request) {
        review.setMadeAt(LocalDateTime.now());
        review.setLastUpdated(LocalDateTime.now());
        review.setEstado(Review.Estado.VISIBLE);
        service.save(review);

        URI location = URI.create("/api/reviews/" + review.getId());
        return ResponseEntity.created(location).body(review);
    }

    @GetMapping("/all")
    @Override
    ResponseEntity<?> all(HttpServletRequest request) {
        List<Review> items = service.list();
        if (items == null) return ResponseEntity.badRequest().build();
        if (items.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(items);
    }

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Review updatedReview, HttpServletRequest request) {
        Optional<Review> existingReview = service.getById(id);
        if (existingReview.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Review review = existingReview.get();
        review.setScore(updatedReview.getScore());
        review.setComment(updatedReview.getComment());
        review.setEstado(updatedReview.getEstado());
        review.setLastUpdated(LocalDateTime.now());

        service.save(review);

        URI location = URI.create("/api/reviews/" + review.getId());
        return ResponseEntity.ok().location(location).body(review);
    }
}
