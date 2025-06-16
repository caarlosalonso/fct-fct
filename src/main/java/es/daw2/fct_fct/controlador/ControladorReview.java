package es.daw2.fct_fct.controlador;

import es.daw2.fct_fct.dto.CreateReviewDTO;
import es.daw2.fct_fct.modelo.Empresa;
import es.daw2.fct_fct.modelo.Review;
import es.daw2.fct_fct.modelo.User;
import es.daw2.fct_fct.servicio.ServicioEmpresa;
import es.daw2.fct_fct.servicio.ServicioReview;
import es.daw2.fct_fct.servicio.ServicioUser;
import es.daw2.fct_fct.utils.SessionsManager;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ControladorReview extends CrudController<Long, Review, CreateReviewDTO, Review, ServicioReview> {

    @Autowired
    private ServicioEmpresa servicioEmpresa;

    @Autowired
    private ServicioUser servicioUser;
    
    @Override
    public ResponseEntity<?> create(@RequestBody CreateReviewDTO dto, HttpServletRequest request) {
        Optional<Empresa> empresaOptional = servicioEmpresa.getById(dto.empresaId());
        if (empresaOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Empresa no encontrada");
        }

        Long userId = SessionsManager.getUserIdFromSession(request);

        Optional<User> userOptional = servicioUser.getById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User no encontrado");
        }

        Review newReview = new Review();
        newReview.setEmpresa(empresaOptional.get());
        newReview.setUser(userOptional.get());
        newReview.setScore((byte) dto.puntuacion());
        newReview.setComment(dto.comentario());
        newReview.setMadeAt(LocalDateTime.now());
        newReview.setLastUpdated(LocalDateTime.now());
        newReview.setEstado("VISIBLE");
        service.save(newReview);

        URI location = URI.create("/api/reviews/" + newReview.getId());
        return ResponseEntity.created(location).body(newReview);
    }

    @GetMapping("/all")
    @Override
    ResponseEntity<?> all(HttpServletRequest request) {
        List<Review> items = service.list();
        System.out.println(items);
        if (items == null) return ResponseEntity.badRequest().build();
        System.out.println("Items: " + items.size());
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
