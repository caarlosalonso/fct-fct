package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.Alumnos;
import es.daw2.fct_fct.repositorio.RepositorioAlumno;

@Service
public class ServicioAlumno implements IFServicioAlumno{

    @Autowired
    RepositorioAlumno repositorioAlumno;

    @Override
    public List<Alumnos> listaAlumnos(){
        return (List<Alumnos>) repositorioAlumno.findAll();
    }

    @Override
    public Alumnos addAlumnos(Alumnos a){
        return repositorioAlumno.save(a);
    }

    @Override
    public Optional<Alumnos> getAlumnosId(Long id){
        return repositorioAlumno.findById(id);
    }

    @Override
    public boolean borrarAlumnos(Long id){
        Optional<Alumnos> alumnoOptional = repositorioAlumno.findById(id);

        if(alumnoOptional.isPresent()){
            repositorioAlumno.delete(alumnoOptional.get());
            return true;
        }
            return false;
    }
}
