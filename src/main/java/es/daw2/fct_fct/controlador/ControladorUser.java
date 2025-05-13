package es.daw2.fct_fct.controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.dto.UserDTO;
import es.daw2.fct_fct.modelo.Users;
import es.daw2.fct_fct.servicio.ServicioUser;

@RestController
public class ControladorUser {
    
    @Autowired
    private ServicioUser servicioUser;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Users user) {
        Users userFound = servicioUser.findByEmailAndPassword(user.getEmail(), user.getPassword());

        if (userFound == null)
            return ResponseEntity.status(401).body("Invalid credentials");
        
        UserDTO dto = new UserDTO(
            userFound.getId(),
            userFound.getName(),
            userFound.getEmail(),
            userFound.isAdmin()
        );

        return ResponseEntity.ok(dto);
    }
}
