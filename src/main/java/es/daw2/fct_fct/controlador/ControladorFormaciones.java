package es.daw2.fct_fct.controlador;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Formacion;
import es.daw2.fct_fct.servicio.ServicioFormacion;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/formaciones")
public class ControladorFormaciones {
    
    @Autowired
    private ServicioFormacion servicioFormacion;

    @GetMapping("/all")
    public ResponseEntity<?> getAllFormaciones() {
        List<Formacion> formaciones = servicioFormacion.getAllFormaciones();
        if (formaciones.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(formaciones);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFormacionById(@PathVariable Long id) {
        Formacion formacion = servicioFormacion.getFormacionById(id);
        if (formacion == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(formacion);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createFormacion(@RequestBody Formacion formacion) {
        Formacion nuevaFormacion = servicioFormacion.createFormacion(formacion);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaFormacion);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateFormacion(@PathVariable Long id, @RequestBody Formacion formacion) {
        Formacion formacionActualizada = servicioFormacion.updateFormacion(id, formacion);
        if (formacionActualizada == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(formacionActualizada);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteFormacion(@PathVariable Long id) {
        servicioFormacion.deleteFormacion(id);
        return ResponseEntity.noContent().build();
    }

}
