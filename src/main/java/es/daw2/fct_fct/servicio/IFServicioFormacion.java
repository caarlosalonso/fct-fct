package es.daw2.fct_fct.servicio;

import java.util.List;

import es.daw2.fct_fct.modelo.Formacion;

public interface IFServicioFormacion {
    List<Formacion> getAllFormaciones();
    Formacion getFormacionById(Long formacion_id);
    Formacion createFormacion(Formacion formacion);
    Formacion updateFormacion(Long formacion_id, Formacion formacion);
    void deleteFormacion(Long formacion_id);
}
