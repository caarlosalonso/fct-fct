package es.daw2.fct_fct.controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.servicio.ServicioAlumno;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class ControladorAlumno {

    @Autowired
    private ServicioAlumno servicioAlumno;

    //cRud
    @GetMapping("/listaAlumnos")
    public ResponseEntity<?> listaAlumnos() {
        return ResponseEntity.ok(servicioAlumno.listaAlumnos());
    }
    
}
