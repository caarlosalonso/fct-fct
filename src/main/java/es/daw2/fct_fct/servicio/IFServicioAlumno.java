package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import es.daw2.fct_fct.modelo.Alumnos;

public interface IFServicioAlumno {
    
    public List<Alumnos> listaAlumnos();
    public Alumnos addAlumnos(Alumnos a);
    public Optional<Alumnos> getAlumnosId(Long id);
    public boolean borrarAlumnos(Long id);
}
