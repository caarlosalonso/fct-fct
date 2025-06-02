package es.daw2.fct_fct.controlador;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import es.daw2.fct_fct.modelo.User;
import es.daw2.fct_fct.servicio.ServicioArchivo;
import es.daw2.fct_fct.servicio.ServicioUser;

@RestController
@RequestMapping("/api/ficheros")
public class ControladorArchivo {

    //@Autowired
    private ServicioArchivo servicioArchivo;

    //@Autowired
    private ServicioUser servicioUser;

    // ???? Un constructor?
    public ControladorArchivo(ServicioArchivo servicioArchivo, ServicioUser servicioUser) {
        this.servicioArchivo = servicioArchivo;
        this.servicioUser = servicioUser;
    }
    
    /**
     * Endpoint para que un alumno autenticado suba un archivo a Firebase Storage.
     * Recibe email y password para validar al usuario, y el propio MultipartFile.
     */
    @PostMapping("/subir")
    public ResponseEntity<?> subir(
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestBody("file") MultipartFile file) {

        try {
            

            //Llamada al servicio que sube el archivo a Firebase
            servicioArchivo.subirArchivo(user, file);

            return ResponseEntity.ok(Map.of("mensaje", "Archivo subido correctamente"));
        } catch (IOException e) {
            return ResponseEntity.status(500)
                                .body(Map.of("error", "Error subiendo el archivo: " + e.getMessage()));
        }
    }
}
