package es.daw2.fct_fct.controlador;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import es.daw2.fct_fct.modelo.User;
import es.daw2.fct_fct.servicio.ServicioArchivo;
import es.daw2.fct_fct.utils.Role;
import es.daw2.fct_fct.utils.SessionsManager;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/archivo")
public class ArchivoController {

    @Autowired
    private ServicioArchivo servicioArchivo;

    @PostMapping("/subir")
    public ResponseEntity<String> subirArchivo(
        @AuthenticationPrincipal User user,
        @RequestParam("archivo") MultipartFile archivo,
        @RequestParam("tipo") String tipo,
        HttpServletRequest request) {
            SessionsManager.isValidSession(request, Role.ALUMNO, Role.TUTOR, Role.ADMIN, Role.COORDINADOR);
            Long userId = (Long) SessionsManager.getUserIdFromSession(request);

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado.");
        }

        try {
            String url = servicioArchivo.subirArchivo(userId, archivo, tipo);
            return ResponseEntity.ok("Archivo subido correctamente. URL: " + url);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Error al subir archivo a Firebase.");
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Error al enviar el correo de notificación.");
        }
    }
}
