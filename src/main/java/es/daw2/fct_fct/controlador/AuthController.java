package es.daw2.fct_fct.controlador;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.firebase.auth.FirebaseAuth;

import es.daw2.fct_fct.modelo.User;
import es.daw2.fct_fct.servicio.ServicioUser;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    ServicioUser ServicioUser;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email, @RequestParam String password, HttpSession session) {
        User u = ServicioUser.findByEmailAndPassword(email, password);
        if (u == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
        }
        session.setAttribute("userId", u.getId());
        return ResponseEntity.ok(Map.of("mensaje", "Login correcto"));
    }

    @GetMapping("/firebaseToken")
    public ResponseEntity<?> getFirebaseToken(HttpSession session) throws Exception {
        Object userIdObj = session.getAttribute("userId");
        if (userIdObj == null) {
            return ResponseEntity.status(401).body(Map.of("error", "No hay sesión activa"));
        }

        Long userId = (Long) userIdObj;
        User u = ServicioUser.getById(userId).orElse(null);
        if (u == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Usuario no encontrado en sesión"));
        }

        String firebaseToken = FirebaseAuth.getInstance()
            .createCustomToken(u.getId().toString());

        return ResponseEntity.ok(Map.of("firebaseToken", firebaseToken));
    }
}
