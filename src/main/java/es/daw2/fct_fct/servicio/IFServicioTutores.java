package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import es.daw2.fct_fct.modelo.Tutores;

public interface IFServicioTutores {
    public List<Tutores> listaTutores();
    public Tutores addTutores(Tutores a);
    public Optional<Tutores> getTutoresId(Long id);
    public boolean borrarTutores(Long id);
}
