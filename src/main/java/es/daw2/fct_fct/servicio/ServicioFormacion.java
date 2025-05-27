package es.daw2.fct_fct.servicio;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import es.daw2.fct_fct.modelo.Formacion;
import es.daw2.fct_fct.repositorio.RepositorioFormaciones;

public class ServicioFormacion implements IFServicioFormacion {

    @Autowired
    private RepositorioFormaciones repositorioFormaciones;

    @Override
    public List<Formacion> getAllFormaciones() {
        return (List<Formacion>) repositorioFormaciones.findAll();
    }

    @Override
    public Formacion getFormacionById(Long formacion_id) {
        return repositorioFormaciones.findById(formacion_id).orElse(null);
    }

    @Override
    public Formacion createFormacion(Formacion formacion) {
        return repositorioFormaciones.save(formacion);
    }

    @Override
    public Formacion updateFormacion(Long formacion_id, Formacion formacion) {
        if (repositorioFormaciones.existsById(formacion_id)) {
            formacion.setFormacion_id(formacion_id);
            return repositorioFormaciones.save(formacion);
        }
        return null; // O lanzar una excepción si se prefiere
    }

    @Override
    public void deleteFormacion(Long formacion_id) {
        if (repositorioFormaciones.existsById(formacion_id)) {
            repositorioFormaciones.deleteById(formacion_id);
        }
    }
}
