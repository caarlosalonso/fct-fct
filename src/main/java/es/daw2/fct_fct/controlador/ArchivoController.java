package es.daw2.fct_fct.controlador;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal; // Si usas Spring Security
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import es.daw2.fct_fct.modelo.User;
import es.daw2.fct_fct.servicio.ServicioArchivo;

@RestController
@RequestMapping("/api/archivo")
public class ArchivoController {

    @Autowired
    private ServicioArchivo servicioArchivo;

    @PostMapping("/subir")
    public ResponseEntity<String> subirArchivo(
            @RequestParam("id") Long idUsuario,
            @RequestParam("archivo") MultipartFile archivo) {
        try {
            String url = servicioArchivo.subirArchivo(idUsuario, archivo);
            return ResponseEntity.ok("Archivo subido correctamente. URL: " + url);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Error al subir archivo a Firebase.");
        }
    }
}
