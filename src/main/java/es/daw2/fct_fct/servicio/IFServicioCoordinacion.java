package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import es.daw2.fct_fct.modelo.Coordinacion;

public interface IFServicioCoordinacion {
    public List<Coordinacion> listaCoordinacion();
    public Coordinacion addCoordinacion(Coordinacion a);
    public Optional<Coordinacion> getCoordinacionId(Long id);
    public boolean borrarCoordinacion(Long id);
}
