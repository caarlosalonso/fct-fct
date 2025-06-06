package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import es.daw2.fct_fct.modelo.Archivo;

public interface IFServicioArchivo {
    
    public List<Archivo> listaArchivos();
    public Archivo addArchivo(Archivo archivo);
    public Optional<Archivo> getArchivoId(Long archivoId);
    public boolean borrarArchivo(Long archivoId);
}
