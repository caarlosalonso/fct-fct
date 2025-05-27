package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import es.daw2.fct_fct.modelo.Alumno;

public interface IFServicioAlumno {
    
    public List<Alumno> listaAlumnos();
    public Alumno addAlumnos(Alumno a);
    public Optional<Alumno> getAlumnosId(Long alumno_id);
    public boolean borrarAlumnos(Long alumno_id);
}
