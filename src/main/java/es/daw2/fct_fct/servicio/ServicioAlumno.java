package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.Alumno;
import es.daw2.fct_fct.repositorio.RepositorioAlumno;

@Service
public class ServicioAlumno implements IFServicioAlumno{

    @Autowired
    RepositorioAlumno repositorioAlumno;

    @Override
    public List<Alumno> listaAlumnos(){
        return (List<Alumno>) repositorioAlumno.findAll();
    }

    @Override
    public Alumno addAlumnos(Alumno a){
        return repositorioAlumno.save(a);
    }

    @Override
    public Optional<Alumno> getAlumnosId(Long alumno_id){
        return repositorioAlumno.findById(alumno_id);
    }

    @Override
    public boolean borrarAlumnos(Long alumno_id){
        Optional<Alumno> alumnoOptional = repositorioAlumno.findById(alumno_id);

        if(alumnoOptional.isPresent()){
            repositorioAlumno.delete(alumnoOptional.get());
            return true;
        }
            return false;
    }
}
