package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import es.daw2.fct_fct.modelo.Archivo;
import es.daw2.fct_fct.repositorio.RepositorioArchivo;

public class ServicioArchivo implements IFServicioArchivo {

    @Autowired
    RepositorioArchivo repositorioArchivo;

    @Override
    public List<Archivo> listaArchivos() {
        return (List<Archivo>) repositorioArchivo.findAll();
    }

    @Override
    public Archivo addArchivo(Archivo archivo) {
        return repositorioArchivo.save(archivo);
    }

    @Override
    public Optional<Archivo> getArchivoId(Long archivoId) {
        return repositorioArchivo.findById(archivoId);
    }

    @Override
    public boolean borrarArchivo(Long archivoId) {
        if (repositorioArchivo.existsById(archivoId)) {
            repositorioArchivo.deleteById(archivoId);
            return true;
        }
        return false;
    }
}
