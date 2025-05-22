package es.daw2.fct_fct.controlador;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Tutor_empresa;
import es.daw2.fct_fct.servicio.ServicioTutor_Empresa;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class ControladorTutor_Empresa {

    @Autowired
    private ServicioTutor_Empresa servicioTutor_Empresa;

    //Crud
    @PostMapping("/addTutor_Empresa")
    public ResponseEntity<?> crearTutor_Empresa(@RequestBody Tutor_empresa t) {
        servicioTutor_Empresa.addTutor_Empresa(t);
        
        URI location = URI.create("/listarTutor_EmpresaId" +t.getId());

        return ResponseEntity.created(location).body(t);
    }
    

    //cRud
    @GetMapping("/listarTutor_Empresa")
    public ResponseEntity<?> listaTutor_Empresa() {
        Iterable<Tutor_empresa> it = null;
        it = servicioTutor_Empresa.listaTutor_Empresa();

        if (it!=null) {
            return ResponseEntity.ok(it);
        }else{
            return ResponseEntity.badRequest().build();
        }
    }

    //cRud
    @GetMapping("/tutor_empresa/{id}")
    public ResponseEntity<?> listaTutor_EmpresaId(@PathVariable Long id) {
        Optional<Tutor_empresa> tutor_empresa = servicioTutor_Empresa.getTutor_EmpresaId(id);

        if (tutor_empresa.isPresent()) {
            return ResponseEntity.ok(tutor_empresa.get());
        }else{
            return ResponseEntity.status(404).body("No se encontraron tutores con el id: " + id); //No me deja poner el notFound()
        }
    }

    //crUd
    @PostMapping("/actualizarTutor_Empresa/{id}")
    public ResponseEntity<?> actualizarTutor_Empresa(@PathVariable Long id, @RequestBody Tutor_empresa t) {
        Optional<Tutor_empresa> tutor_empresa = servicioTutor_Empresa.getTutor_EmpresaId(id);

        if (!tutor_empresa.isPresent()) {
            return ResponseEntity.notFound().build();     
        }
    
        t.setId(id);
        
        Tutor_empresa tutorActualizado = servicioTutor_Empresa.addTutor_Empresa(t);

        URI location = URI.create("/listarTutor_EmpresaId" + t.getId());

        return ResponseEntity.ok().location(location).body(tutorActualizado);
    }

    //cruD
    @DeleteMapping("/borrarTutor_Empresa/{id}")
    public ResponseEntity<?> borrarTutor_Empresa(@PathVariable Long id) {
        boolean tutor_empresaEliminado = servicioTutor_Empresa.borrarTutor_Empresa(id);

        if (tutor_empresaEliminado) {
            return ResponseEntity.ok().body("Tutor de empresa eliminado con éxito");
        } else {
            return ResponseEntity.status(404).body("No se encontraron tutores con el id: " + id);
        }
    }
}
