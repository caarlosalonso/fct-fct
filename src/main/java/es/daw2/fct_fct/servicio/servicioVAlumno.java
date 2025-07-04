package es.daw2.fct_fct.servicio;

import java.util.Optional;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.vAlumno;
import es.daw2.fct_fct.repositorio.RepositorioVAlumno;

@Service
public class servicioVAlumno extends AbstractService<Long, vAlumno, RepositorioVAlumno> {

    /*public Optional<vAlumno> getByUserId(Long id) {
        List<vAlumno> listaVAlumnos = (List<vAlumno>) repository.findAll();
        for (vAlumno vAlumno : listaVAlumnos) {
            if (vAlumno.getId().equals(id)) {
                return Optional.of(vAlumno);
            }
        }
        return Optional.empty();
    }*/
        
    public Optional<vAlumno> findById(Long id){
        System.out.println("Buscando vAlumno por userId: " + id);
        Optional<vAlumno> va = repository.findById(id);
        System.out.println("Encontrado: " + va.isPresent());
        return va;
    }
}
