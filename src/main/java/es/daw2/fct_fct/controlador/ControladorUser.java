package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.dto.UserDTO;
import es.daw2.fct_fct.modelo.Users;
import es.daw2.fct_fct.servicio.ServicioUser;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


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

    //Crud
    @PostMapping("/addUser")
    public ResponseEntity<?> crearAlumno(@RequestBody Users u) {
        servicioUser.addUsers(u);
        
        URI location = URI.create("listarUsersId" + u.getId());

        return ResponseEntity.created(location).body(u);
    }
    
    //cRud
    @GetMapping("/listarUsers")
    public ResponseEntity<?> listaUsers() {
        Iterable<Users> it = null;
        it = servicioUser.listaUsers();

        if (it!=null) {
            return ResponseEntity.ok(it);
        }else{
            return ResponseEntity.badRequest().build();
        }
    }
    
    //cRud
    @GetMapping("/users/{id}")
    public ResponseEntity<?> listaAlumnosId(@PathVariable Long id) {
        Optional<Users> users = servicioUser.getUsersId(id);
        if (users.isPresent()) {
            return ResponseEntity.ok(users.get());
        }
        return ResponseEntity.status(404).body("No se encontraron usuarios con el id: " + id); //No me deja poner el notFound()
    }

    //crUd
    @PostMapping("/actualizarUsers/{id}")
    public ResponseEntity<?> actualizarUser(@PathVariable Long id, @RequestBody Users u){
        Optional<Users> optional = servicioUser.getUsersId(id);

        if(!optional.isPresent()){
            return ResponseEntity.notFound().build();
        }

        u.setId(id);

        Users userActualizado = servicioUser.addUsers(u);

        URI location = URI.create("/users/" +u.getId());

        return ResponseEntity.ok().location(location).body(userActualizado);
    }

    //cruD
    @DeleteMapping("/borrarUser/{id}")
    public ResponseEntity<?> borrarUser(@PathVariable Long id){
        boolean userBorrado = servicioUser.borrarUsers(id);

        if(userBorrado){
            return ResponseEntity.ok().body("Usuario borrado correctamente");
        }else{
            return ResponseEntity.badRequest().body("No se ha podido borrar el usuario con id: " + id);
        }
    }
}
