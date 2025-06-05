package es.daw2.fct_fct.controlador;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import es.daw2.fct_fct.modelo.User;
import es.daw2.fct_fct.servicio.ServicioArchivo;
import es.daw2.fct_fct.servicio.ServicioUser;

@RestController
@RequestMapping("/api/ficheros")
public class ControladorArchivo {

    private final ServicioArchivo servicioArchivo;

    private final ServicioUser servicioUser;

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
            @RequestParam("file") MultipartFile file) throws IOException {

            System.out.println("Nombre: " + file.getOriginalFilename());
            System.out.println("Tamaño: " + file.getSize());
            System.out.println("Tipo: " + file.getContentType());


        // 1) Validamos credenciales usando tu servicio
        User user = servicioUser.findByEmailAndPassword(email, password);
        if (user == null) {
            return ResponseEntity.status(401)
                                .body(Map.of("error", "Credenciales inválidas"));
        }

        //Llamada al servicio que sube el archivo a Firebase
        try {
            servicioArchivo.subirArchivo(user, file);
        } catch (Exception e) {
            e.printStackTrace(); // o log
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }

        return ResponseEntity.ok(Map.of("mensaje", "Archivo subido correctamente"));
    }
}
