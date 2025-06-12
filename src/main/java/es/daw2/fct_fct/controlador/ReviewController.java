package es.daw2.fct_fct.controlador;

import es.daw2.fct_fct.modelo.Review;
import es.daw2.fct_fct.servicio.ReviewService;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController extends CrudController<Long, Review, Review, Review, ReviewService> {

    @Autowired
    private ReviewService reviewService;

    @Override
    public ResponseEntity<?> create(@RequestBody Review review, HttpServletRequest request) {
        review.setMadeAt(LocalDateTime.now());
        review.setLastUpdated(LocalDateTime.now());
        review.setEstado(Review.Estado.VISIBLE);
        reviewService.save(review);

        URI location = URI.create("/api/reviews/" + review.getId());
        return ResponseEntity.created(location).body(review);
    }

    @Override
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Review updatedReview, HttpServletRequest request) {
        Optional<Review> existingReview = reviewService.getById(id);
        if (existingReview.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Review review = existingReview.get();
        review.setScore(updatedReview.getScore());
        review.setComment(updatedReview.getComment());
        review.setEstado(updatedReview.getEstado());
        review.setLastUpdated(LocalDateTime.now());

        reviewService.save(review);

        URI location = URI.create("/api/reviews/" + review.getId());
        return ResponseEntity.ok().location(location).body(review);
    }
}
