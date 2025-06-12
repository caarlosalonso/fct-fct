package es.daw2.fct_fct.controlador.vistas;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import es.daw2.fct_fct.modelo.vistas.ViewReviews;
import es.daw2.fct_fct.servicio.vistas.ViewReviewsService;

@RestController
@RequestMapping("/api/view-reviews")
public class ViewReviewsController {

    @Autowired
    private ViewReviewsService service;

    @GetMapping("/all")
    public ResponseEntity<?> obtenerTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<ViewReviews> obtenerPorId(@PathVariable Long reviewId) {
        return service.buscarPorId(reviewId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
