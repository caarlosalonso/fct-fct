package es.daw2.fct_fct.controlador;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.firebase.auth.FirebaseAuth;

import es.daw2.fct_fct.dto.LoginRequestDTO;
import es.daw2.fct_fct.modelo.User;
import es.daw2.fct_fct.servicio.ServicioUser;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    ServicioUser ServicioUser;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO dto) throws Exception {
        // Valida con el dto el email y password del usuario en la base de datos
        User u = ServicioUser.findByEmailAndPassword(dto.getEmail(), dto.getPassword());
        if (u == null) {
        return ResponseEntity.status(401).build();
        }

    // Genera custom token
    String firebaseToken = FirebaseAuth.getInstance()
        .createCustomToken(u.getId().toString());

    
    return ResponseEntity.ok(Map.of("firebaseToken", firebaseToken));
    }
}